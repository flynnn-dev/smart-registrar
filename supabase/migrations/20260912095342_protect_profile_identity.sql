-- Students may update their own profile, but cannot change identity fields.
-- Checking role/email with a subquery on public.profiles recursed under RLS.

create function private.protect_profile_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not private.is_admin() then
    new.id := old.id;
    new.role := old.role;
    new.email := old.email;
  end if;

  return new;
end;
$$;

create trigger profiles_protect_identity
  before update on public.profiles
  for each row execute function private.protect_profile_identity();

drop policy "users_update_own_profile" on public.profiles;

create policy "users_update_own_profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
