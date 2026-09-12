-- Phase 18: close remaining client write paths, freeze appointment identity,
-- deny private-schema helpers to JWT users, and force RLS on public tables.

alter table public.profiles force row level security;
alter table public.document_types force row level security;
alter table public.operating_hours force row level security;
alter table public.system_settings force row level security;
alter table public.appointments force row level security;
alter table public.document_requests force row level security;
alter table public.queue_entries force row level security;
alter table public.request_status_history force row level security;
alter table public.notifications force row level security;
alter table public.transaction_records force row level security;

alter table private.request_number_counters enable row level security;
alter table private.request_number_counters force row level security;
alter table private.queue_number_counters enable row level security;
alter table private.queue_number_counters force row level security;

revoke insert on table public.appointments from anon, authenticated;
revoke insert on table public.document_requests from anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from public.document_requests
    where appointment_id is not null
    group by appointment_id
    having count(*) > 1
  ) then
    create unique index if not exists document_requests_appointment_id_uidx
      on public.document_requests (appointment_id)
      where appointment_id is not null;
  end if;
end $$;

create or replace function private.protect_appointment_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select auth.uid()) is not null then
    new.id := old.id;
    new.student_id := old.student_id;
    new.created_at := old.created_at;

    if not private.is_staff() then
      new.appointment_date := old.appointment_date;
      new.appointment_time := old.appointment_time;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists appointments_protect_identity on public.appointments;

create trigger appointments_protect_identity
  before update on public.appointments
  for each row execute function private.protect_appointment_identity();

revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function private.current_user_role() to authenticated, service_role;
grant execute on function private.is_staff() to authenticated, service_role;
grant execute on function private.is_admin() to authenticated, service_role;

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.list_available_appointment_slots(date, date) from public, anon;
grant execute on function public.list_available_appointment_slots(date, date)
  to authenticated, service_role;
revoke all on function public.create_student_document_request(uuid, text, date, time, text)
  from public, anon;
grant execute on function public.create_student_document_request(uuid, text, date, time, text)
  to authenticated, service_role;
revoke all on function public.call_next_queue_entry(date) from public, anon;
grant execute on function public.call_next_queue_entry(date) to authenticated, service_role;
revoke all on function public.get_queue_board(date) from public, anon;
grant execute on function public.get_queue_board(date) to authenticated, service_role;
revoke all on function public.is_student_id_available(text) from public;
grant execute on function public.is_student_id_available(text) to anon, authenticated;

alter default privileges in schema public revoke all on tables from public, anon, authenticated;
alter default privileges in schema private revoke all on tables from public, anon, authenticated;
alter default privileges in schema private revoke all on functions from public, anon, authenticated;
