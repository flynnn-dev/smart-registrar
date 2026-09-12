-- Daily queue rules: one serving number at a time, valid status
-- transitions, transaction audit, atomic Call Next, and a board
-- snapshot that does not leak other students' identities.

create unique index queue_entries_one_serving_per_day_uidx
  on public.queue_entries (queue_date)
  where status = 'serving';

create function private.is_valid_queue_transition(
  old_status public.queue_status,
  new_status public.queue_status
)
returns boolean
language sql
immutable
as $$
  select case
    when old_status is not distinct from new_status then true
    when old_status = 'waiting' then new_status in ('serving', 'skipped', 'cancelled')
    when old_status = 'serving' then new_status in ('completed', 'skipped', 'cancelled')
    when old_status = 'skipped' then new_status in ('serving', 'cancelled')
    else false
  end;
$$;

create function private.protect_queue_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select auth.uid()) is not null then
    new.id := old.id;
    new.request_id := old.request_id;
    new.queue_date := old.queue_date;
    new.queue_number := old.queue_number;
    new.created_at := old.created_at;
  end if;

  return new;
end;
$$;

create function private.validate_queue_status()
returns trigger
language plpgsql
as $$
begin
  if not private.is_valid_queue_transition(old.status, new.status) then
    raise exception 'Invalid queue status transition from % to %',
      old.status, new.status;
  end if;

  if new.status = 'serving' and old.status is distinct from 'serving' then
    new.called_at := now();
  end if;

  if new.status = 'completed' then
    new.completed_at := coalesce(new.completed_at, now());
  end if;

  return new;
end;
$$;

create function private.audit_queue()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := (select auth.uid());
  linked_student uuid;
begin
  if new.status is not distinct from old.status then
    return new;
  end if;

  select r.student_id
  into linked_student
  from public.document_requests r
  where r.id = new.request_id;

  insert into public.transaction_records (
    request_id, student_id, action, performed_by, remarks
  ) values (
    new.request_id,
    linked_student,
    case
      when new.status = 'serving' then 'queue_called'
      else 'queue_status_changed'
    end,
    actor,
    'Queue ' || new.queue_number || ' changed from ' || old.status::text ||
      ' to ' || new.status::text || ' for ' || new.queue_date::text
  );

  return new;
end;
$$;

create trigger queue_entries_protect_identity
  before update on public.queue_entries
  for each row execute function private.protect_queue_identity();

create trigger queue_entries_validate_status
  before update of status on public.queue_entries
  for each row execute function private.validate_queue_status();

create trigger queue_entries_audit
  after update of status on public.queue_entries
  for each row execute function private.audit_queue();

create function public.call_next_queue_entry(p_date date)
returns table (
  id uuid,
  queue_number text,
  status public.queue_status,
  request_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed public.queue_entries%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not private.is_staff() then
    raise exception 'Staff access required';
  end if;

  if p_date is null then
    raise exception 'Queue date is required';
  end if;

  perform pg_advisory_xact_lock(872314, hashtext(p_date::text));

  if exists (
    select 1
    from public.queue_entries
    where queue_date = p_date
      and status = 'serving'
  ) then
    raise exception 'Complete or skip the current number first.';
  end if;

  update public.queue_entries as q
  set status = 'serving'
  where q.id = (
    select e.id
    from public.queue_entries e
    where e.queue_date = p_date
      and e.status = 'waiting'
    order by e.queue_number
    limit 1
    for update
  )
  returning * into claimed;

  if claimed.id is null then
    raise exception 'No one is waiting in the queue.';
  end if;

  return query
  select claimed.id, claimed.queue_number, claimed.status, claimed.request_id;
end;
$$;

create function public.get_queue_board(p_date date)
returns table (
  serving_number text,
  next_numbers text[],
  waiting_count integer,
  serving_count integer,
  completed_count integer,
  skipped_count integer,
  cancelled_count integer,
  estimated_minutes_per_ticket integer,
  your_number text,
  your_status public.queue_status,
  people_ahead integer,
  estimated_wait_minutes integer
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user uuid := (select auth.uid());
  v_serving text;
  v_next text[];
  v_waiting integer := 0;
  v_serving_count integer := 0;
  v_completed integer := 0;
  v_skipped integer := 0;
  v_cancelled integer := 0;
  v_minutes integer := 5;
  v_your_number text;
  v_your_status public.queue_status;
  v_ahead integer;
begin
  if v_user is null then
    raise exception 'Authentication required';
  end if;

  if p_date is null then
    raise exception 'Queue date is required';
  end if;

  if not private.is_staff()
    and not exists (
      select 1
      from public.queue_entries q
      join public.document_requests r on r.id = q.request_id
      where q.queue_date = p_date
        and r.student_id = v_user
    )
  then
    raise exception 'You do not have a queue ticket for that date.';
  end if;

  select q.queue_number
  into v_serving
  from public.queue_entries q
  where q.queue_date = p_date
    and q.status = 'serving'
  limit 1;

  select coalesce(array_agg(n.queue_number order by n.queue_number), '{}')
  into v_next
  from (
    select e.queue_number
    from public.queue_entries e
    where e.queue_date = p_date
      and e.status = 'waiting'
    order by e.queue_number
    limit 3
  ) n;

  select
    count(*) filter (where e.status = 'waiting')::integer,
    count(*) filter (where e.status = 'serving')::integer,
    count(*) filter (where e.status = 'completed')::integer,
    count(*) filter (where e.status = 'skipped')::integer,
    count(*) filter (where e.status = 'cancelled')::integer
  into v_waiting, v_serving_count, v_completed, v_skipped, v_cancelled
  from public.queue_entries e
  where e.queue_date = p_date;

  select greatest(coalesce((s.value #>> '{}')::integer, 5), 0)
  into v_minutes
  from public.system_settings s
  where s.key = 'estimated_minutes_per_queue';

  v_minutes := coalesce(v_minutes, 5);

  select q.queue_number, q.status
  into v_your_number, v_your_status
  from public.queue_entries q
  join public.document_requests r on r.id = q.request_id
  where q.queue_date = p_date
    and r.student_id = v_user
  order by
    case q.status
      when 'serving' then 0
      when 'waiting' then 1
      when 'skipped' then 2
      else 3
    end,
    q.queue_number
  limit 1;

  if v_your_status = 'waiting' then
    select count(*)::integer
    into v_ahead
    from public.queue_entries e
    where e.queue_date = p_date
      and e.status = 'waiting'
      and e.queue_number < v_your_number;
  elsif v_your_status = 'serving' then
    v_ahead := 0;
  end if;

  return query
  select
    v_serving,
    coalesce(v_next, '{}'::text[]),
    coalesce(v_waiting, 0),
    coalesce(v_serving_count, 0),
    coalesce(v_completed, 0),
    coalesce(v_skipped, 0),
    coalesce(v_cancelled, 0),
    v_minutes,
    v_your_number,
    v_your_status,
    v_ahead,
    case
      when v_ahead is null then null
      else v_ahead * v_minutes
    end;
end;
$$;

revoke all on function public.call_next_queue_entry(date)
  from public, anon;
grant execute on function public.call_next_queue_entry(date)
  to authenticated, service_role;

revoke all on function public.get_queue_board(date)
  from public, anon;
grant execute on function public.get_queue_board(date)
  to authenticated, service_role;
