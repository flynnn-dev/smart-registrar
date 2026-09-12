-- Student request workflow: slot availability without leaking other
-- students' appointments, plus an atomic create that binds the appointment
-- and request in one transaction.

create or replace function public.list_available_appointment_slots(
  p_from date default null,
  p_to date default null
)
returns table (
  appointment_date date,
  appointment_time time,
  capacity integer,
  booked integer,
  remaining integer
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_today date := (timezone('Asia/Manila', now()))::date;
  v_now time := (timezone('Asia/Manila', now()))::time;
  v_from date;
  v_to date;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  v_from := greatest(coalesce(p_from, v_today), v_today);
  v_to := coalesce(p_to, v_from + 13);

  if v_to < v_from then
    raise exception 'Invalid date range';
  end if;

  if v_to > v_from + 20 then
    v_to := v_from + 20;
  end if;

  return query
  with days as (
    select gs::date as day
    from generate_series(v_from, v_to, interval '1 day') as gs
  ),
  slots as (
    select
      d.day as slot_date,
      gs.slot_ts::time as slot_time,
      oh.max_per_slot as slot_capacity
    from days d
    join public.operating_hours oh
      on oh.day_of_week = extract(dow from d.day)::smallint
     and oh.is_active
    cross join lateral generate_series(
      d.day + oh.start_time,
      d.day + oh.end_time - make_interval(mins => oh.slot_minutes),
      make_interval(mins => oh.slot_minutes)
    ) as gs(slot_ts)
    where d.day > v_today
       or (d.day = v_today and gs.slot_ts::time > v_now)
  )
  select
    s.slot_date,
    s.slot_time,
    s.slot_capacity,
    count(a.id)::integer,
    greatest(s.slot_capacity - count(a.id)::integer, 0)
  from slots s
  left join public.appointments a
    on a.appointment_date = s.slot_date
   and a.appointment_time = s.slot_time
   and a.status in ('scheduled', 'checked_in')
  where not exists (
    select 1
    from public.appointments mine
    where mine.student_id = (select auth.uid())
      and mine.appointment_date = s.slot_date
      and mine.appointment_time = s.slot_time
      and mine.status in ('scheduled', 'checked_in')
  )
  group by s.slot_date, s.slot_time, s.slot_capacity
  order by s.slot_date, s.slot_time;
end;
$$;

create or replace function public.create_student_document_request(
  p_document_type_id uuid,
  p_purpose text,
  p_appointment_date date,
  p_appointment_time time,
  p_remarks text default null
)
returns table (
  request_id uuid,
  request_number text,
  queue_number text,
  status public.request_status,
  document_name text,
  appointment_date date,
  appointment_time time
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := (select auth.uid());
  v_purpose text := nullif(btrim(p_purpose), '');
  v_remarks text := nullif(btrim(p_remarks), '');
  v_doc public.document_types%rowtype;
  v_appt uuid;
  v_req public.document_requests%rowtype;
  v_queue text;
  v_today date := (timezone('Asia/Manila', now()))::date;
  v_now time := (timezone('Asia/Manila', now()))::time;
begin
  if v_user is null then
    raise exception 'Authentication required';
  end if;

  if private.current_user_role() is distinct from 'student' then
    raise exception 'Only students can submit document requests.';
  end if;

  if v_purpose is null or char_length(v_purpose) < 10 then
    raise exception 'Enter a purpose of at least 10 characters.';
  end if;

  if char_length(v_purpose) > 500 then
    raise exception 'Purpose is too long.';
  end if;

  if v_remarks is not null and char_length(v_remarks) > 500 then
    raise exception 'Notes are too long.';
  end if;

  select *
  into v_doc
  from public.document_types
  where id = p_document_type_id
    and is_active;

  if not found then
    raise exception 'Select a valid document type.';
  end if;

  if p_appointment_date is null or p_appointment_time is null then
    raise exception 'Select an appointment schedule.';
  end if;

  if p_appointment_date < v_today
     or (p_appointment_date = v_today and p_appointment_time <= v_now) then
    raise exception 'Select a future appointment schedule.';
  end if;

  if not exists (
    select 1
    from public.operating_hours oh
    where oh.is_active
      and oh.day_of_week = extract(dow from p_appointment_date)::smallint
      and p_appointment_time >= oh.start_time
      and p_appointment_time < oh.end_time
      and mod(
        extract(epoch from (p_appointment_time - oh.start_time))::integer,
        oh.slot_minutes * 60
      ) = 0
  ) then
    raise exception 'That appointment slot is not offered.';
  end if;

  insert into public.appointments (
    student_id,
    appointment_date,
    appointment_time,
    status
  )
  values (
    v_user,
    p_appointment_date,
    p_appointment_time,
    'scheduled'
  )
  returning id into v_appt;

  insert into public.document_requests (
    student_id,
    document_type_id,
    appointment_id,
    purpose,
    remarks,
    status
  )
  values (
    v_user,
    v_doc.id,
    v_appt,
    v_purpose,
    v_remarks,
    'submitted'
  )
  returning * into v_req;

  select q.queue_number
  into v_queue
  from public.queue_entries q
  where q.request_id = v_req.id
  order by q.created_at desc
  limit 1;

  return query
  select
    v_req.id,
    v_req.request_number,
    v_queue,
    v_req.status,
    v_doc.name,
    p_appointment_date,
    p_appointment_time;
exception
  when unique_violation then
    raise exception 'You already have an appointment in that slot.';
end;
$$;

revoke all on function public.list_available_appointment_slots(date, date)
  from public, anon;
grant execute on function public.list_available_appointment_slots(date, date)
  to authenticated, service_role;

revoke all on function public.create_student_document_request(uuid, text, date, time, text)
  from public, anon;
grant execute on function public.create_student_document_request(uuid, text, date, time, text)
  to authenticated, service_role;
