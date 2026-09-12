import "server-only";

import {
  addCalendarDays,
  formatAppointmentSlot,
  schoolCalendarDate,
  schoolDayBounds,
  startOfSchoolMonth,
  startOfSchoolWeek,
} from "@/lib/format/datetime";
import { buildRequestProgress } from "@/lib/requests/progress";
import type { RequestHistoryEvent } from "@/lib/requests/progress";
import {
  REQUEST_PAGE_SIZE,
  type StaffRequestFilters,
} from "@/lib/registrar/request-filters";
import type { AppointmentStatus, RequestStatus } from "@/lib/status";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StaffRequestSummary = {
  id: string;
  requestNumber: string;
  documentName: string;
  status: RequestStatus;
  submittedAt: string;
  appointmentLabel: string | null;
  studentUserId: string | null;
  studentName: string;
  studentCampusId: string | null;
};

export type StaffRequestDetail = StaffRequestSummary & {
  purpose: string | null;
  remarks: string | null;
  completedAt: string | null;
  updatedAt: string;
  studentEmail: string;
  studentPhone: string | null;
  appointmentStatus: AppointmentStatus | null;
  queueNumber: string | null;
  queueDate: string | null;
  history: RequestHistoryEvent[];
  progress: ReturnType<typeof buildRequestProgress>;
};

export type StaffRequestListData = {
  requests: StaffRequestSummary[];
  total: number;
  page: number;
  pageCount: number;
  documentTypes: Array<{ id: string; name: string }>;
};

type ProfileEmbed = {
  id?: string;
  full_name: string | null;
  student_id: string | null;
  email?: string;
  phone?: string | null;
};

type RequestListRow = {
  id: string;
  request_number: string;
  status: RequestStatus;
  submitted_at: string;
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
  profiles: ProfileEmbed | ProfileEmbed[] | null;
};

type RequestDetailRow = RequestListRow & {
  purpose: string | null;
  remarks: string | null;
  updated_at: string;
  completed_at: string | null;
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

function toSummary(row: RequestListRow): StaffRequestSummary {
  const documentType = one(row.document_types);
  const appointment = one(row.appointments);
  const profile = one(row.profiles);

  return {
    id: row.id,
    requestNumber: row.request_number,
    documentName: documentType?.name ?? "Registrar document",
    status: row.status,
    submittedAt: row.submitted_at,
    appointmentLabel: appointment
      ? formatAppointmentSlot(
          appointment.appointment_date,
          appointment.appointment_time
        )
      : null,
    studentUserId: profile?.id ?? null,
    studentName: profile?.full_name?.trim() || "Student",
    studentCampusId: profile?.student_id ?? null,
  };
}

const LIST_SELECT =
  "id, request_number, status, submitted_at, document_types(name), appointments(appointment_date, appointment_time, status), profiles!document_requests_student_id_fkey(id, full_name, student_id)";

const DETAIL_SELECT =
  "id, request_number, status, purpose, remarks, submitted_at, updated_at, completed_at, document_types(name), appointments(appointment_date, appointment_time, status), queue_entries(queue_number, queue_date), profiles!document_requests_student_id_fkey(id, full_name, student_id, email, phone)";

function dateBounds(filter: StaffRequestFilters["date"]): {
  start?: string;
  end?: string;
} {
  if (filter === "all") {
    return {};
  }

  const today = schoolCalendarDate();

  if (filter === "today") {
    return schoolDayBounds(today);
  }

  if (filter === "week") {
    return {
      start: schoolDayBounds(startOfSchoolWeek(today)).start,
      end: schoolDayBounds(addCalendarDays(startOfSchoolWeek(today), 7)).start,
    };
  }

  const monthStart = startOfSchoolMonth(today);
  const nextMonth = `${addCalendarDays(monthStart, 32).slice(0, 7)}-01`;

  return {
    start: schoolDayBounds(monthStart).start,
    end: schoolDayBounds(nextMonth).start,
  };
}

export async function getStaffRequestList(
  filters: StaffRequestFilters
): Promise<StaffRequestListData> {
  const supabase = await createSupabaseServerClient();
  const bounds = dateBounds(filters.date);
  const from = (filters.page - 1) * REQUEST_PAGE_SIZE;
  const to = from + REQUEST_PAGE_SIZE - 1;

  let matchingStudentIds: string[] | null = null;

  if (filters.q) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .or(
        `full_name.ilike.%${filters.q}%,student_id.ilike.%${filters.q}%,email.ilike.%${filters.q}%`
      )
      .eq("role", "student");

    if (error) {
      throw new Error(`Unable to search students: ${error.message}`);
    }

    matchingStudentIds = (data ?? []).map((row) => row.id);
  }

  let query = supabase
    .from("document_requests")
    .select(LIST_SELECT, { count: "exact" });

  if (filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.documentTypeId) {
    query = query.eq("document_type_id", filters.documentTypeId);
  }

  if (bounds.start) {
    query = query.gte("submitted_at", bounds.start);
  }

  if (bounds.end) {
    query = query.lt("submitted_at", bounds.end);
  }

  if (filters.q) {
    const studentClause =
      matchingStudentIds && matchingStudentIds.length > 0
        ? `,student_id.in.(${matchingStudentIds.join(",")})`
        : "";
    query = query.or(`request_number.ilike.%${filters.q}%${studentClause}`);
  }

  const sortColumn =
    filters.sort === "number"
      ? "request_number"
      : filters.sort === "status"
        ? "status"
        : "submitted_at";

  const [listResult, typesResult] = await Promise.all([
    query.order(sortColumn, { ascending: filters.sort !== "submitted" }).range(from, to),
    supabase.from("document_types").select("id, name").order("name"),
  ]);

  if (listResult.error) {
    throw new Error(`Unable to load requests: ${listResult.error.message}`);
  }

  if (typesResult.error) {
    throw new Error(
      `Unable to load document types: ${typesResult.error.message}`
    );
  }

  const total = listResult.count ?? 0;

  return {
    requests: ((listResult.data ?? []) as RequestListRow[]).map(toSummary),
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / REQUEST_PAGE_SIZE)),
    documentTypes: typesResult.data ?? [],
  };
}

export async function getStaffRequestDetail(
  requestId: string
): Promise<StaffRequestDetail | null> {
  const supabase = await createSupabaseServerClient();
  const [requestResult, historyResult] = await Promise.all([
    supabase
      .from("document_requests")
      .select(DETAIL_SELECT)
      .eq("id", requestId)
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

  const row = requestResult.data as RequestDetailRow;
  const appointment = one(row.appointments);
  const profile = one(row.profiles);
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
    purpose: row.purpose,
    remarks: row.remarks,
    completedAt: row.completed_at,
    updatedAt: row.updated_at,
    studentEmail: profile?.email ?? "",
    studentPhone: profile?.phone ?? null,
    appointmentStatus: appointment?.status ?? null,
    queueNumber: queue?.queue_number ?? null,
    queueDate: queue?.queue_date ?? null,
    history,
    progress: buildRequestProgress(row.status, history, row.submitted_at),
  };
}
