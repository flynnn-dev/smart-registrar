-- Staff request (and appointment) status buttons failed the same way
-- the queue did: these triggers are invoker and authenticated can no
-- longer execute the private transition helpers.

create or replace function private.validate_request_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not private.is_valid_request_transition(old.status, new.status) then
    raise exception 'Invalid request status transition from % to %',
      old.status, new.status;
  end if;

  if new.status = 'completed' then
    new.completed_at := coalesce(new.completed_at, now());
  end if;

  return new;
end;
$$;

create or replace function private.validate_appointment_status()
returns trigger
language plpgsql
security definer
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

revoke all on function private.validate_request_status() from public, anon, authenticated;
revoke all on function private.validate_appointment_status() from public, anon, authenticated;

notify pgrst, 'reload schema';
