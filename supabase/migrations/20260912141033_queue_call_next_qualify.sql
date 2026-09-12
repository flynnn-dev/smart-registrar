-- RETURNS TABLE exposes a "status" variable, so unqualified
-- queue_entries.status in Call Next is ambiguous and the claim fails.

create or replace function public.call_next_queue_entry(p_date date)
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
    from public.queue_entries e
    where e.queue_date = p_date
      and e.status = 'serving'
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

revoke all on function public.call_next_queue_entry(date) from public, anon;
grant execute on function public.call_next_queue_entry(date)
  to authenticated, service_role;

notify pgrst, 'reload schema';
