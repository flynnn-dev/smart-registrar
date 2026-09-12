-- Hosted Auth keeps "confirm email" on, but school demo addresses never
-- receive that mail. Mark new users confirmed so register can sign them in.

create or replace function private.confirm_email_on_signup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.email_confirmed_at := coalesce(new.email_confirmed_at, now());
  return new;
end;
$$;

revoke all on function private.confirm_email_on_signup() from public, anon, authenticated;

drop trigger if exists confirm_email_on_signup on auth.users;

create trigger confirm_email_on_signup
  before insert on auth.users
  for each row
  execute function private.confirm_email_on_signup();

update auth.users
set email_confirmed_at = now()
where email_confirmed_at is null
  and email is not null;
