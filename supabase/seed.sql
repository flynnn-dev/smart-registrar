-- Fictional development seed data only. Never use real personal information.

insert into public.document_types (name, description, processing_days, is_active)
values
  (
    'Transcript of Records',
    'Official academic record of completed courses and grades.',
    7,
    true
  ),
  (
    'Certificate of Enrollment',
    'Confirms that the student is currently enrolled for the term.',
    2,
    true
  ),
  (
    'Certificate of Grades',
    'Summary of grades for a requested academic period.',
    5,
    true
  ),
  (
    'Good Moral Certificate',
    'Certification of student conduct for scholarship or transfer use.',
    3,
    true
  ),
  (
    'Diploma Request',
    'Request to process or release a diploma after clearance.',
    10,
    true
  ),
  (
    'Other Registrar Document',
    'Other registrar-issued certification not listed above.',
    4,
    true
  )
on conflict (name) do update
set
  description = excluded.description,
  processing_days = excluded.processing_days,
  is_active = excluded.is_active;

insert into public.operating_hours (
  day_of_week,
  start_time,
  end_time,
  slot_minutes,
  max_per_slot,
  is_active
)
values
  (1, '08:00', '17:00', 30, 8, true),
  (2, '08:00', '17:00', 30, 8, true),
  (3, '08:00', '17:00', 30, 8, true),
  (4, '08:00', '17:00', 30, 8, true),
  (5, '08:00', '17:00', 30, 8, true)
on conflict (day_of_week) do update
set
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  slot_minutes = excluded.slot_minutes,
  max_per_slot = excluded.max_per_slot,
  is_active = excluded.is_active;

insert into public.system_settings (key, value)
values
  ('school_name', '"Smart Registrar University"'::jsonb),
  ('max_appointments_per_slot', '8'::jsonb),
  ('queue_letter', '"A"'::jsonb),
  ('estimated_minutes_per_queue', '5'::jsonb)
on conflict (key) do update
set value = excluded.value;
