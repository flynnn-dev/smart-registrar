import type { AppointmentStatus } from "@/lib/status";
import type { AppointmentRecord } from "@/lib/appointments/types";

export type AppointmentQueryRow = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  profiles:
    | { full_name: string | null; student_id: string | null }
    | { full_name: string | null; student_id: string | null }[]
    | null;
  document_requests:
    | {
        request_number: string;
        document_types: { name: string } | { name: string }[] | null;
      }
    | {
        request_number: string;
        document_types: { name: string } | { name: string }[] | null;
      }[]
    | null;
};

export function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function toAppointmentRecord(
  row: AppointmentQueryRow,
  fallbackName = "Student"
): AppointmentRecord {
  const profile = one(row.profiles);
  const request = one(row.document_requests);
  const documentType = one(request?.document_types);

  return {
    id: row.id,
    date: row.appointment_date,
    time: row.appointment_time,
    status: row.status,
    studentName: profile?.full_name?.trim() || fallbackName,
    studentId: profile?.student_id ?? null,
    requestNumber: request?.request_number ?? null,
    documentName: documentType?.name ?? null,
  };
}

export const APPOINTMENT_SELECT =
  "id, appointment_date, appointment_time, status, profiles(full_name, student_id), document_requests(request_number, document_types(name))";
