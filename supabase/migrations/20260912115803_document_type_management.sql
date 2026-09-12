-- Staff may edit catalog fields, but identity stays stable. Types with
-- request history cannot be deleted; deactivate them instead.

revoke delete on table public.document_types from anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'document_types_name_not_blank'
      and conrelid = 'public.document_types'::regclass
  ) then
    alter table public.document_types
      add constraint document_types_name_not_blank
      check (length(trim(name)) > 0);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'document_types_processing_days_max'
      and conrelid = 'public.document_types'::regclass
  ) then
    alter table public.document_types
      add constraint document_types_processing_days_max
      check (processing_days <= 60);
  end if;
end $$;

create unique index if not exists document_types_name_lower_uidx
  on public.document_types (lower(trim(name)));

create function private.prepare_document_type()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.name := trim(new.name);
  new.description := nullif(trim(coalesce(new.description, '')), '');

  if tg_op = 'UPDATE' and (select auth.uid()) is not null then
    new.id := old.id;
    new.created_at := old.created_at;
  end if;

  return new;
end;
$$;

create trigger document_types_prepare
  before insert or update on public.document_types
  for each row execute function private.prepare_document_type();

create function private.prevent_used_document_type_delete()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.document_requests
    where document_type_id = old.id
  ) then
    raise exception 'Cannot delete a document type that has requests';
  end if;

  return old;
end;
$$;

create trigger document_types_prevent_used_delete
  before delete on public.document_types
  for each row execute function private.prevent_used_document_type_delete();
