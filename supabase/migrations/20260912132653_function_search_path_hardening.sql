-- Pin search_path on leftover private helpers flagged by security advisors.

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.is_valid_request_transition(
  old_status public.request_status,
  new_status public.request_status
)
returns boolean
language sql
immutable
set search_path = public
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

create or replace function private.request_notification_copy(p_status public.request_status)
returns table (title text, message text, type public.notification_type)
language sql
immutable
set search_path = public
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

create or replace function private.validate_request_status()
returns trigger
language plpgsql
set search_path = public
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

create or replace function private.is_valid_appointment_transition(
  old_status public.appointment_status,
  new_status public.appointment_status
)
returns boolean
language sql
immutable
set search_path = public
as $$
  select case
    when old_status is not distinct from new_status then true
    when old_status = 'scheduled' then new_status in ('checked_in', 'cancelled', 'missed')
    when old_status = 'checked_in' then new_status in ('completed', 'cancelled', 'missed')
    else false
  end;
$$;

create or replace function private.validate_appointment_status()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not private.is_valid_appointment_transition(old.status, new.status) then
    raise exception 'Invalid appointment status transition from % to %',
      old.status, new.status;
  end if;

  return new;
end;
$$;

create or replace function private.is_valid_queue_transition(
  old_status public.queue_status,
  new_status public.queue_status
)
returns boolean
language sql
immutable
set search_path = public
as $$
  select case
    when old_status is not distinct from new_status then true
    when old_status = 'waiting' then new_status in ('serving', 'skipped', 'cancelled')
    when old_status = 'serving' then new_status in ('completed', 'skipped', 'cancelled')
    when old_status = 'skipped' then new_status in ('serving', 'cancelled')
    else false
  end;
$$;

create or replace function private.validate_queue_status()
returns trigger
language plpgsql
set search_path = public
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

revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function private.current_user_role() to authenticated, service_role;
grant execute on function private.is_staff() to authenticated, service_role;
grant execute on function private.is_admin() to authenticated, service_role;
