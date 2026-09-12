import "server-only";

import { formatAppointmentSlot, schoolCalendarDate } from "@/lib/format/datetime";
import {
  STUDENT_PAGE_SIZE,
  type StaffStudentFilters,
} from "@/lib/registrar/student-filters";
import type { StaffRequestSummary } from "@/lib/registrar/requests";
import type {
  StaffStudentAppointment,
  StaffStudentSummary,
} from "@/lib/registrar/student-types";
import {
  isActiveRequestStatus,
  type AppointmentStatus,
  type RequestStatus,
} from "@/lib/status";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type {
  StaffStudentAppointment,
  StaffStudentLatestRequest,
  StaffStudentSummary,
  StudentAccountStatus,
} from "@/lib/registrar/student-types";
export { STUDENT_ACCOUNT_STATUS_LABELS } from "@/lib/registrar/student-types";

export type StaffStudentDetail = StaffStudentSummary & {
  requests: StaffRequestSummary[];
  upcomingAppointments: StaffStudentAppointment[];
};

export type StaffStudentListData = {
  students: StaffStudentSummary[];
  total: number;
  page: number;
  pageCount: number;
};

type AppointmentEmbed = {
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
};

type RequestEmbed = {
  id: string;
  request_number: string;
  status: RequestStatus;
  submitted_at: string;
  document_types: { name: string } | { name: string }[] | null;
  appointments?: AppointmentEmbed | AppointmentEmbed[] | null;
};

type StudentRow = {
  id: string;
  student_id: string | null;
  full_name: string | null;
  email: string;
  phone: string | null;
  document_requests: RequestEmbed[] | RequestEmbed | null;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function requestRows(value: StudentRow["document_requests"]): RequestEmbed[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function documentName(
  value: RequestEmbed["document_types"]
): string {
  return one(value)?.name ?? "Registrar document";
}

function toSummary(row: StudentRow): StaffStudentSummary {
  const requests = [...requestRows(row.document_requests)].sort((left, right) =>
    right.submitted_at.localeCompare(left.submitted_at)
  );
  const latest = requests[0] ?? null;

  return {
    id: row.id,
    campusId: row.student_id,
    name: row.full_name?.trim() || "Student",
    email: row.email,
    phone: row.phone,
    requestCount: requests.length,
    latestRequest: latest
      ? {
          id: latest.id,
          requestNumber: latest.request_number,
          documentName: documentName(latest.document_types),
          status: latest.status,
        }
      : null,
    accountStatus: requests.some((request) =>
      isActiveRequestStatus(request.status)
    )
      ? "active"
      : "idle",
  };
}

const STUDENT_LIST_SELECT =
  "id, student_id, full_name, email, phone, document_requests(id, request_number, status, submitted_at, document_types(name))";

export async function getStaffStudentList(
  filters: StaffStudentFilters
): Promise<StaffStudentListData> {
  const supabase = await createSupabaseServerClient();
  const from = (filters.page - 1) * STUDENT_PAGE_SIZE;
  const to = from + STUDENT_PAGE_SIZE - 1;

  let query = supabase
    .from("profiles")
    .select(STUDENT_LIST_SELECT, { count: "exact" })
    .eq("role", "student");

  if (filters.q) {
    query = query.or(
      `full_name.ilike.%${filters.q}%,student_id.ilike.%${filters.q}%,email.ilike.%${filters.q}%,phone.ilike.%${filters.q}%`
    );
  }

  const { data, error, count } = await query
    .order("full_name", { ascending: true, nullsFirst: false })
    .range(from, to);

  if (error) {
    throw new Error(`Unable to load students: ${error.message}`);
  }

  const total = count ?? 0;

  return {
    students: ((data ?? []) as StudentRow[]).map(toSummary),
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / STUDENT_PAGE_SIZE)),
  };
}

export async function getStaffStudentDetail(
  studentId: string
): Promise<StaffStudentDetail | null> {
  const supabase = await createSupabaseServerClient();
  const today = schoolCalendarDate();

  const [profileResult, appointmentResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, student_id, full_name, email, phone, document_requests(id, request_number, status, submitted_at, document_types(name), appointments(appointment_date, appointment_time, status))"
      )
      .eq("id", studentId)
      .eq("role", "student")
      .maybeSingle(),
    supabase
      .from("appointments")
      .select(
        "id, appointment_date, appointment_time, status, document_requests(request_number, document_types(name))"
      )
      .eq("student_id", studentId)
      .in("status", ["scheduled", "checked_in"])
      .gte("appointment_date", today)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true }),
  ]);

  if (profileResult.error) {
    throw new Error(`Unable to load student: ${profileResult.error.message}`);
  }

  if (appointmentResult.error) {
    throw new Error(
      `Unable to load student appointments: ${appointmentResult.error.message}`
    );
  }

  if (!profileResult.data) {
    return null;
  }

  const row = profileResult.data as StudentRow;
  const summary = toSummary(row);
  const requests = [...requestRows(row.document_requests)]
    .sort((left, right) => right.submitted_at.localeCompare(left.submitted_at))
    .map((request) => {
      const appointment = one(request.appointments ?? null);

      return {
        id: request.id,
        requestNumber: request.request_number,
        documentName: documentName(request.document_types),
        status: request.status,
        submittedAt: request.submitted_at,
        appointmentLabel: appointment
          ? formatAppointmentSlot(
              appointment.appointment_date,
              appointment.appointment_time
            )
          : null,
        studentUserId: row.id,
        studentName: summary.name,
        studentCampusId: summary.campusId,
      } satisfies StaffRequestSummary;
    });

  return {
    ...summary,
    requests,
    upcomingAppointments: (appointmentResult.data ?? []).map((appointment) => {
      const linked = one(
        appointment.document_requests as
          | {
              request_number: string;
              document_types: { name: string } | { name: string }[] | null;
            }
          | {
              request_number: string;
              document_types: { name: string } | { name: string }[] | null;
            }[]
          | null
      );

      return {
        id: appointment.id,
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        status: appointment.status as AppointmentStatus,
        label: formatAppointmentSlot(
          appointment.appointment_date,
          appointment.appointment_time
        ),
        requestNumber: linked?.request_number ?? null,
        documentName: linked ? documentName(linked.document_types) : null,
      };
    }),
  };
}
