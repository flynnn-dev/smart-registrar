-- Staff queue writes failed: validate_queue_status is an invoker trigger
-- and authenticated can no longer execute private.is_valid_queue_transition.

create or replace function private.validate_queue_status()
returns trigger
language plpgsql
security definer
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

revoke all on function private.validate_queue_status() from public, anon, authenticated;

notify pgrst, 'reload schema';
