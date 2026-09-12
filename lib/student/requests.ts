import "server-only";

import { formatAppointmentSlot } from "@/lib/format/datetime";
import { buildRequestProgress } from "@/lib/requests/progress";
import type { RequestDetail, RequestSummary } from "@/lib/requests/types";
import { isActiveRequestStatus, type AppointmentStatus, type RequestStatus } from "@/lib/status";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StudentRequestLists = {
  active: RequestSummary[];
  past: RequestSummary[];
};

type RequestQueryRow = {
  id: string;
  request_number: string;
  status: RequestStatus;
  purpose: string | null;
  remarks: string | null;
  submitted_at: string;
  updated_at: string;
  completed_at: string | null;
  document_types: { name: string } | { name: string }[] | null;
  appointments: {
    appointment_date: string;
    appointment_time: string;
    status: AppointmentStatus;
  } | {
    appointment_date: string;
    appointment_time: string;
    status: AppointmentStatus;
  }[] | null;
  queue_entries:
    | { queue_number: string; queue_date: string }
    | { queue_number: string; queue_date: string }[]
    | null;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function pickQueue(
  value:
    | { queue_number: string; queue_date: string }
    | { queue_number: string; queue_date: string }[]
    | null,
  appointmentDate?: string
): { queue_number: string; queue_date: string } | null {
  const entries = !value ? [] : Array.isArray(value) ? value : [value];

  if (appointmentDate) {
    const matched = entries.find((entry) => entry.queue_date === appointmentDate);
    if (matched) {
      return matched;
    }
  }

  return (
    [...entries].sort((left, right) =>
      right.queue_date.localeCompare(left.queue_date)
    )[0] ?? null
  );
}

const REQUEST_SELECT =
  "id, request_number, status, purpose, remarks, submitted_at, updated_at, completed_at, document_types(name), appointments(appointment_date, appointment_time, status), queue_entries(queue_number, queue_date)";

function toSummary(row: RequestQueryRow): RequestSummary {
  const documentType = one(row.document_types);
  const appointment = one(row.appointments);
  const queue = pickQueue(row.queue_entries, appointment?.appointment_date);

  return {
    id: row.id,
    requestNumber: row.request_number,
    documentName: documentType?.name ?? "Registrar document",
    status: row.status,
    purpose: row.purpose,
    submittedAt: row.submitted_at,
    appointmentLabel: appointment
      ? formatAppointmentSlot(
          appointment.appointment_date,
          appointment.appointment_time
        )
      : null,
    queueNumber: queue?.queue_number ?? null,
  };
}

export async function getStudentRequests(
  studentId: string
): Promise<StudentRequestLists> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("document_requests")
    .select(REQUEST_SELECT)
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load requests: ${error.message}`);
  }

  const summaries = ((data ?? []) as RequestQueryRow[]).map(toSummary);

  return {
    active: summaries.filter((request) => isActiveRequestStatus(request.status)),
    past: summaries.filter((request) => !isActiveRequestStatus(request.status)),
  };
}

export async function getStudentRequestDetail(
  requestId: string,
  studentId: string
): Promise<RequestDetail | null> {
  const supabase = await createSupabaseServerClient();
  const [requestResult, historyResult] = await Promise.all([
    supabase
      .from("document_requests")
      .select(REQUEST_SELECT)
      .eq("id", requestId)
      .eq("student_id", studentId)
      .maybeSingle(),
    supabase
      .from("request_status_history")
      .select("id, old_status, new_status, remarks, created_at")
      .eq("request_id", requestId)
      .order("created_at", { ascending: true }),
  ]);

  if (requestResult.error) {
    throw new Error(`Unable to load request: ${requestResult.error.message}`);
  }

  if (historyResult.error) {
    throw new Error(
      `Unable to load request history: ${historyResult.error.message}`
    );
  }

  if (!requestResult.data) {
    return null;
  }

  const row = requestResult.data as RequestQueryRow;
  const appointment = one(row.appointments);
  const queue = pickQueue(row.queue_entries, appointment?.appointment_date);
  const history = (historyResult.data ?? []).map((event) => ({
    id: event.id,
    oldStatus: event.old_status,
    newStatus: event.new_status,
    remarks: event.remarks,
    createdAt: event.created_at,
  }));

  return {
    ...toSummary(row),
    remarks: row.remarks,
    completedAt: row.completed_at,
    updatedAt: row.updated_at,
    appointmentStatus: appointment?.status ?? null,
    queueDate: queue?.queue_date ?? null,
    history,
    progress: buildRequestProgress(row.status, history, row.submitted_at),
  };
}
