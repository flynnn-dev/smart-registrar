-- Appointment status rules, appointment audit rows, and allow SQL/admin
-- maintenance to change profile identity when no JWT is present.

create or replace function private.protect_profile_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select auth.uid()) is not null and not private.is_admin() then
    new.id := old.id;
    new.role := old.role;
    new.email := old.email;
  end if;

  return new;
end;
$$;

create function private.is_valid_appointment_transition(
  old_status public.appointment_status,
  new_status public.appointment_status
)
returns boolean
language sql
immutable
as $$
  select case
    when old_status is not distinct from new_status then true
    when old_status = 'scheduled' then new_status in ('checked_in', 'cancelled', 'missed')
    when old_status = 'checked_in' then new_status in ('completed', 'cancelled', 'missed')
    else false
  end;
$$;

create function private.validate_appointment_status()
returns trigger
language plpgsql
as $$
begin
  if not private.is_valid_appointment_transition(old.status, new.status) then
    raise exception 'Invalid appointment status transition from % to %',
      old.status, new.status;
  end if;

  return new;
end;
$$;

create function private.audit_appointment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := (select auth.uid());
  linked_request uuid;
begin
  select r.id
  into linked_request
  from public.document_requests r
  where r.appointment_id = new.id
  limit 1;

  if tg_op = 'INSERT' then
    insert into public.transaction_records (
      request_id, student_id, action, performed_by, remarks
    ) values (
      linked_request,
      new.student_id,
      'appointment_created',
      actor,
      'Appointment scheduled for ' || new.appointment_date::text ||
        ' at ' || new.appointment_time::text
    );

    return new;
  end if;

  if new.status is distinct from old.status then
    insert into public.transaction_records (
      request_id, student_id, action, performed_by, remarks
    ) values (
      linked_request,
      new.student_id,
      'appointment_status_changed',
      actor,
      'Appointment status changed from ' || old.status::text ||
        ' to ' || new.status::text
    );
  end if;

  return new;
end;
$$;

create trigger appointments_validate_status
  before update of status on public.appointments
  for each row execute function private.validate_appointment_status();

create trigger appointments_audit
  after insert or update of status on public.appointments
  for each row execute function private.audit_appointment();
