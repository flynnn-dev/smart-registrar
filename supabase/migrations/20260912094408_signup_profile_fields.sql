-- Copy safe signup fields onto the new profile. Role stays student.
-- is_student_id_available only returns a boolean so registration can fail early.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, student_id, phone, role)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'student_id', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), ''),
    'student'
  );

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create or replace function public.is_student_id_available(p_student_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1
    from public.profiles
    where student_id = nullif(trim(p_student_id), '')
  );
$$;

revoke all on function public.is_student_id_available(text) from public;
grant execute on function public.is_student_id_available(text) to anon, authenticated;
