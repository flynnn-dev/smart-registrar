-- Students and staff may mark their own notifications read, but they
-- cannot rewrite the notification body or reassign ownership.

create function private.protect_notification_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select auth.uid()) is not null then
    new.id := old.id;
    new.user_id := old.user_id;
    new.request_id := old.request_id;
    new.title := old.title;
    new.message := old.message;
    new.type := old.type;
    new.created_at := old.created_at;
  end if;

  return new;
end;
$$;

create trigger notifications_protect_identity
  before update on public.notifications
  for each row execute function private.protect_notification_identity();
