-- Live queue board: broadcast a date-only ping so students and staff
-- refresh without leaking other students' identities.

create or replace function private.broadcast_queue_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  queue_day date;
begin
  queue_day := coalesce(new.queue_date, old.queue_date);

  begin
    perform realtime.send(
      jsonb_build_object('date', queue_day::text),
      'queue_changed',
      'queue',
      true
    );
  exception
    when others then
      null;
  end;

  return coalesce(new, old);
end;
$$;

revoke all on function private.broadcast_queue_change() from public, anon, authenticated;

drop trigger if exists queue_entries_broadcast_change on public.queue_entries;

create trigger queue_entries_broadcast_change
  after insert or update of status, queue_date
  on public.queue_entries
  for each row
  execute function private.broadcast_queue_change();

drop policy if exists authenticated_can_read_queue_broadcast on realtime.messages;

create policy authenticated_can_read_queue_broadcast
  on realtime.messages
  for select
  to authenticated
  using (
    (select realtime.topic()) = 'queue'
    and realtime.messages.extension = 'broadcast'
  );
