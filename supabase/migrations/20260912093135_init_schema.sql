-- Smart Registrar initial schema, integrity rules, and RLS.
-- Grants are explicit so tables stay reachable after the Data API default change.

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to postgres, service_role, authenticated;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.app_role as enum ('student', 'registrar', 'admin');

create type public.appointment_status as enum (
  'scheduled',
  'checked_in',
  'completed',
  'cancelled',
  'missed'
);

create type public.request_status as enum (
  'submitted',
  'under_review',
  'processing',
  'ready_for_pickup',
  'completed',
  'rejected'
);

create type public.queue_status as enum (
  'waiting',
  'serving',
  'completed',
  'skipped',
  'cancelled'
);

create type public.notification_type as enum (
  'request_update',
  'ready_for_pickup',
  'appointment',
  'system'
);

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  student_id text,
  full_name text,
  email text not null,
  phone text,
  role public.app_role not null default 'student',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_student_id_not_blank check (
    student_id is null or length(trim(student_id)) > 0
  )
);

create table public.document_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  processing_days integer not null default 3 check (processing_days >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.operating_hours (
  id uuid primary key default gen_random_uuid(),
  day_of_week smallint not null unique check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_minutes integer not null default 30 check (slot_minutes > 0),
  max_per_slot integer not null default 8 check (max_per_slot > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint operating_hours_window check (end_time > start_time)
);

create table public.system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  appointment_date date not null,
  appointment_time time not null,
  status public.appointment_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.document_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique,
  student_id uuid not null references public.profiles (id) on delete cascade,
  document_type_id uuid not null references public.document_types (id) on delete restrict,
  appointment_id uuid references public.appointments (id) on delete restrict,
  status public.request_status not null default 'submitted',
  purpose text,
  remarks text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.queue_entries (
  id uuid primary key default gen_random_uuid(),
  queue_number text not null,
  request_id uuid not null references public.document_requests (id) on delete cascade,
  queue_date date not null,
  status public.queue_status not null default 'waiting',
  called_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.request_status_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.document_requests (id) on delete cascade,
  old_status public.request_status,
  new_status public.request_status not null,
  changed_by uuid references public.profiles (id) on delete set null,
  remarks text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  request_id uuid references public.document_requests (id) on delete cascade,
  title text not null,
  message text not null,
  type public.notification_type not null default 'system',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.transaction_records (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.document_requests (id) on delete set null,
  student_id uuid references public.profiles (id) on delete set null,
  action text not null,
  performed_by uuid references public.profiles (id) on delete set null,
  remarks text,
  created_at timestamptz not null default now()
);

create table private.request_number_counters (
  year integer primary key,
  last_value integer not null default 0
);

create table private.queue_number_counters (
  queue_date date primary key,
  last_value integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create unique index profiles_student_id_uidx
  on public.profiles (student_id)
  where student_id is not null;

create index profiles_role_idx on public.profiles (role);
create index profiles_email_idx on public.profiles (email);

create index document_types_active_idx
  on public.document_types (is_active)
  where is_active;

create index appointments_student_id_idx on public.appointments (student_id);
create index appointments_date_idx on public.appointments (appointment_date);
create index appointments_status_idx on public.appointments (status);
create index appointments_slot_idx
  on public.appointments (appointment_date, appointment_time);

create unique index appointments_active_student_slot_uidx
  on public.appointments (student_id, appointment_date, appointment_time)
  where status in ('scheduled', 'checked_in');

create index document_requests_student_id_idx on public.document_requests (student_id);
create index document_requests_status_idx on public.document_requests (status);
create index document_requests_document_type_id_idx
  on public.document_requests (document_type_id);
create index document_requests_created_at_idx
  on public.document_requests (created_at desc);
create index document_requests_submitted_at_idx
  on public.document_requests (submitted_at desc);
create index document_requests_appointment_id_idx
  on public.document_requests (appointment_id);

create unique index queue_entries_date_number_uidx
  on public.queue_entries (queue_date, queue_number);
create unique index queue_entries_request_date_uidx
  on public.queue_entries (request_id, queue_date);
create index queue_entries_date_status_idx
  on public.queue_entries (queue_date, status);

create index request_status_history_request_id_idx
  on public.request_status_history (request_id, created_at);

create index notifications_user_created_idx
  on public.notifications (user_id, created_at desc);
create index notifications_unread_idx
  on public.notifications (user_id)
  where is_read = false;

create index transaction_records_request_id_idx
  on public.transaction_records (request_id);
create index transaction_records_student_id_idx
  on public.transaction_records (student_id);
create index transaction_records_created_at_idx
  on public.transaction_records (created_at desc);

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------

create function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function private.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = (select auth.uid());
$$;

create function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(private.current_user_role() in ('registrar', 'admin'), false);
$$;

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(private.current_user_role() = 'admin', false);
$$;

create function private.next_request_number()
returns text
language plpgsql
security definer
set search_path = public, private
as $$
declare
  current_year integer := extract(year from now())::integer;
  next_value integer;
begin
  insert into private.request_number_counters as counters (year, last_value)
  values (current_year, 1)
  on conflict (year) do update
    set last_value = counters.last_value + 1
  returning last_value into next_value;

  return 'REG-' || current_year::text || '-' || lpad(next_value::text, 6, '0');
end;
$$;

create function private.next_queue_number(p_date date)
returns text
language plpgsql
security definer
set search_path = public, private
as $$
declare
  next_value integer;
begin
  insert into private.queue_number_counters as counters (queue_date, last_value)
  values (p_date, 1)
  on conflict (queue_date) do update
    set last_value = counters.last_value + 1
  returning last_value into next_value;

  return 'A-' || lpad(next_value::text, 3, '0');
end;
$$;

create function private.is_valid_request_transition(
  old_status public.request_status,
  new_status public.request_status
)
returns boolean
language sql
immutable
as $$
  select case
    when old_status is not distinct from new_status then true
    when old_status = 'submitted' then new_status in ('under_review', 'rejected')
    when old_status = 'under_review' then new_status in ('processing', 'rejected', 'submitted')
    when old_status = 'processing' then new_status in ('ready_for_pickup', 'rejected', 'under_review')
    when old_status = 'ready_for_pickup' then new_status in ('completed', 'processing')
    when old_status = 'rejected' then new_status in ('submitted', 'under_review')
    else false
  end;
$$;

create function private.request_notification_copy(p_status public.request_status)
returns table (title text, message text, type public.notification_type)
language sql
immutable
as $$
  select copies.title, copies.message, copies.type
  from (
    values
      (
        'submitted'::public.request_status,
        'Request submitted',
        'Your document request has been submitted.',
        'request_update'::public.notification_type
      ),
      (
        'under_review',
        'Request under review',
        'Your request is now under review.',
        'request_update'
      ),
      (
        'processing',
        'Request processing',
        'Your request is now being processed.',
        'request_update'
      ),
      (
        'ready_for_pickup',
        'Document ready for pickup',
        'Your document is ready for pickup.',
        'ready_for_pickup'
      ),
      (
        'completed',
        'Request completed',
        'Your request has been completed.',
        'request_update'
      ),
      (
        'rejected',
        'Request needs correction',
        'Your request needs correction.',
        'request_update'
      )
  ) as copies (status, title, message, type)
  where copies.status = p_status;
$$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    'student'
  );

  return new;
end;
$$;

create function private.sync_profile_role_claim()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and new.role is not distinct from old.role then
    return new;
  end if;

  update auth.users
  set raw_app_meta_data =
    coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', new.role::text)
  where id = new.id;

  return new;
end;
$$;

create function private.assign_request_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.request_number is null or new.request_number = '' then
    new.request_number := private.next_request_number();
  end if;

  if new.submitted_at is null then
    new.submitted_at := now();
  end if;

  return new;
end;
$$;

create function private.assign_queue_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.queue_number is null or new.queue_number = '' then
    new.queue_number := private.next_queue_number(new.queue_date);
  end if;

  return new;
end;
$$;

create function private.enforce_appointment_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cap integer;
  taken integer;
begin
  if new.status not in ('scheduled', 'checked_in') then
    return new;
  end if;

  select coalesce(oh.max_per_slot, (select (value #>> '{}')::integer from public.system_settings where key = 'max_appointments_per_slot'), 8)
  into cap
  from public.operating_hours oh
  where oh.day_of_week = extract(dow from new.appointment_date)::smallint
    and oh.is_active
  limit 1;

  cap := coalesce(cap, 8);

  select count(*)
  into taken
  from public.appointments
  where appointment_date = new.appointment_date
    and appointment_time = new.appointment_time
    and status in ('scheduled', 'checked_in')
    and id is distinct from new.id;

  if taken >= cap then
    raise exception 'This appointment slot is no longer available.';
  end if;

  return new;
end;
$$;

create function private.validate_request_status()
returns trigger
language plpgsql
as $$
begin
  if not private.is_valid_request_transition(old.status, new.status) then
    raise exception 'Invalid request status transition from % to %', old.status, new.status;
  end if;

  if new.status = 'completed' then
    new.completed_at := coalesce(new.completed_at, now());
  end if;

  return new;
end;
$$;

create function private.audit_document_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := (select auth.uid());
  copy_title text;
  copy_message text;
  copy_type public.notification_type;
  queue_day date;
begin
  if tg_op = 'INSERT' then
    insert into public.request_status_history (
      request_id, old_status, new_status, changed_by, remarks
    ) values (
      new.id, null, new.status, actor, new.remarks
    );

    insert into public.transaction_records (
      request_id, student_id, action, performed_by, remarks
    ) values (
      new.id, new.student_id, 'request_created', actor, new.purpose
    );

    select title, message, type
    into copy_title, copy_message, copy_type
    from private.request_notification_copy(new.status);

    insert into public.notifications (
      user_id, request_id, title, message, type
    ) values (
      new.student_id,
      new.id,
      coalesce(copy_title, 'Request update'),
      coalesce(copy_message, 'Your request was updated.'),
      coalesce(copy_type, 'request_update')
    );

    select a.appointment_date
    into queue_day
    from public.appointments a
    where a.id = new.appointment_id;

    insert into public.queue_entries (request_id, queue_date, status)
    values (new.id, coalesce(queue_day, current_date), 'waiting');

    return new;
  end if;

  if new.status is distinct from old.status then
    insert into public.request_status_history (
      request_id, old_status, new_status, changed_by, remarks
    ) values (
      new.id, old.status, new.status, actor, new.remarks
    );

    insert into public.transaction_records (
      request_id, student_id, action, performed_by, remarks
    ) values (
      new.id,
      new.student_id,
      'status_changed',
      actor,
      'Status changed from ' || old.status::text || ' to ' || new.status::text
    );

    select title, message, type
    into copy_title, copy_message, copy_type
    from private.request_notification_copy(new.status);

    insert into public.notifications (
      user_id, request_id, title, message, type
    ) values (
      new.student_id,
      new.id,
      coalesce(copy_title, 'Request update'),
      coalesce(copy_message, 'Your request was updated.'),
      coalesce(copy_type, 'request_update')
    );
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

create trigger profiles_sync_role_claim
  after insert or update of role on public.profiles
  for each row execute function private.sync_profile_role_claim();

create trigger document_types_set_updated_at
  before update on public.document_types
  for each row execute function private.set_updated_at();

create trigger operating_hours_set_updated_at
  before update on public.operating_hours
  for each row execute function private.set_updated_at();

create trigger system_settings_set_updated_at
  before update on public.system_settings
  for each row execute function private.set_updated_at();

create trigger appointments_set_updated_at
  before update on public.appointments
  for each row execute function private.set_updated_at();

create trigger appointments_enforce_capacity
  before insert or update on public.appointments
  for each row execute function private.enforce_appointment_capacity();

create trigger document_requests_set_updated_at
  before update on public.document_requests
  for each row execute function private.set_updated_at();

create trigger document_requests_assign_number
  before insert on public.document_requests
  for each row execute function private.assign_request_number();

create trigger document_requests_validate_status
  before update of status on public.document_requests
  for each row execute function private.validate_request_status();

create trigger document_requests_audit
  after insert or update of status on public.document_requests
  for each row execute function private.audit_document_request();

create trigger queue_entries_assign_number
  before insert on public.queue_entries
  for each row execute function private.assign_queue_number();

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;

grant usage on schema public to anon, authenticated, service_role;

grant select on table public.document_types to anon, authenticated, service_role;
grant insert, update on table public.document_types to authenticated, service_role;

grant select on table public.operating_hours to anon, authenticated, service_role;
grant insert, update on table public.operating_hours to authenticated, service_role;

grant select on table public.system_settings to authenticated, service_role;
grant insert, update, delete on table public.system_settings to authenticated, service_role;

grant select, update on table public.profiles to authenticated, service_role;

grant select, insert, update on table public.appointments to authenticated, service_role;
grant select, insert, update on table public.document_requests to authenticated, service_role;
grant select, update on table public.queue_entries to authenticated, service_role;

grant select on table public.request_status_history to authenticated, service_role;
grant select, update on table public.notifications to authenticated, service_role;
grant select on table public.transaction_records to authenticated, service_role;

grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;

grant execute on function private.current_user_role() to authenticated, service_role;
grant execute on function private.is_staff() to authenticated, service_role;
grant execute on function private.is_admin() to authenticated, service_role;

revoke all on function public.handle_new_user() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.document_types enable row level security;
alter table public.operating_hours enable row level security;
alter table public.system_settings enable row level security;
alter table public.appointments enable row level security;
alter table public.document_requests enable row level security;
alter table public.queue_entries enable row level security;
alter table public.request_status_history enable row level security;
alter table public.notifications enable row level security;
alter table public.transaction_records enable row level security;

create policy "users_read_own_profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "staff_read_profiles"
  on public.profiles
  for select
  to authenticated
  using ((select private.is_staff()));

create policy "users_update_own_profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check (
    (select auth.uid()) = id
    and role = (select p.role from public.profiles p where p.id = (select auth.uid()))
    and email = (select p.email from public.profiles p where p.id = (select auth.uid()))
  );

create policy "admins_update_profiles"
  on public.profiles
  for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "anyone_reads_active_document_types"
  on public.document_types
  for select
  to anon, authenticated
  using (is_active);

create policy "staff_read_all_document_types"
  on public.document_types
  for select
  to authenticated
  using ((select private.is_staff()));

create policy "staff_insert_document_types"
  on public.document_types
  for insert
  to authenticated
  with check ((select private.is_staff()));

create policy "staff_update_document_types"
  on public.document_types
  for update
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

create policy "anyone_reads_active_hours"
  on public.operating_hours
  for select
  to anon, authenticated
  using (is_active);

create policy "staff_read_operating_hours"
  on public.operating_hours
  for select
  to authenticated
  using ((select private.is_staff()));

create policy "staff_manage_operating_hours"
  on public.operating_hours
  for all
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

create policy "staff_read_settings"
  on public.system_settings
  for select
  to authenticated
  using ((select private.is_staff()));

create policy "admins_manage_settings"
  on public.system_settings
  for all
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "students_read_own_appointments"
  on public.appointments
  for select
  to authenticated
  using ((select auth.uid()) = student_id);

create policy "staff_read_appointments"
  on public.appointments
  for select
  to authenticated
  using ((select private.is_staff()));

create policy "students_create_own_appointments"
  on public.appointments
  for insert
  to authenticated
  with check (
    (select auth.uid()) = student_id
    and status = 'scheduled'
  );

create policy "students_update_own_appointments"
  on public.appointments
  for update
  to authenticated
  using (
    (select auth.uid()) = student_id
    and status = 'scheduled'
  )
  with check (
    (select auth.uid()) = student_id
    and status in ('scheduled', 'cancelled')
  );

create policy "staff_manage_appointments"
  on public.appointments
  for update
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

create policy "students_read_own_requests"
  on public.document_requests
  for select
  to authenticated
  using ((select auth.uid()) = student_id);

create policy "staff_read_requests"
  on public.document_requests
  for select
  to authenticated
  using ((select private.is_staff()));

create policy "students_create_own_requests"
  on public.document_requests
  for insert
  to authenticated
  with check (
    (select auth.uid()) = student_id
    and status = 'submitted'
  );

create policy "staff_update_requests"
  on public.document_requests
  for update
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

create policy "students_read_own_queue"
  on public.queue_entries
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.document_requests r
      where r.id = queue_entries.request_id
        and r.student_id = (select auth.uid())
    )
  );

create policy "staff_read_queue"
  on public.queue_entries
  for select
  to authenticated
  using ((select private.is_staff()));

create policy "staff_manage_queue"
  on public.queue_entries
  for update
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

create policy "students_read_own_history"
  on public.request_status_history
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.document_requests r
      where r.id = request_status_history.request_id
        and r.student_id = (select auth.uid())
    )
  );

create policy "staff_read_history"
  on public.request_status_history
  for select
  to authenticated
  using ((select private.is_staff()));

create policy "users_read_own_notifications"
  on public.notifications
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users_update_own_notifications"
  on public.notifications
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "students_read_own_transactions"
  on public.transaction_records
  for select
  to authenticated
  using ((select auth.uid()) = student_id);

create policy "staff_read_transactions"
  on public.transaction_records
  for select
  to authenticated
  using ((select private.is_staff()));
