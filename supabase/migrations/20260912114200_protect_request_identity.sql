-- Staff may change request status and remarks, but they cannot reassign
-- a request, rewrite its number, or move it to another document type.

create function private.protect_request_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select auth.uid()) is not null then
    new.id := old.id;
    new.request_number := old.request_number;
    new.student_id := old.student_id;
    new.document_type_id := old.document_type_id;
    new.appointment_id := old.appointment_id;
    new.purpose := old.purpose;
    new.submitted_at := old.submitted_at;
    new.created_at := old.created_at;
  end if;

  return new;
end;
$$;

create trigger document_requests_protect_identity
  before update on public.document_requests
  for each row execute function private.protect_request_identity();
