import "server-only";

import {
  formatAppointmentSlot,
  formatDateTime,
} from "@/lib/format/datetime";
import {
  isActiveRequestStatus,
  type AppointmentStatus,
  type RequestStatus,
} from "@/lib/status";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type DashboardStats = {
  activeRequests: number;
  readyForPickup: number;
  completedRequests: number;
  upcomingAppointment: string | null;
};

export type FeaturedRequest = {
  id: string;
  requestNumber: string;
  documentName: string;
  status: RequestStatus;
  appointmentLabel: string | null;
  updatedLabel: string;
};

export type StudentDashboardData = {
  stats: DashboardStats;
  featuredRequest: FeaturedRequest | null;
};

type RequestRow = {
  id: string;
  request_number: string;
  status: RequestStatus;
  updated_at: string;
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
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

const FEATURED_PRIORITY: RequestStatus[] = [
  "ready_for_pickup",
  "processing",
  "under_review",
  "submitted",
];

function pickFeatured(requests: RequestRow[]): RequestRow | null {
  for (const status of FEATURED_PRIORITY) {
    const match = requests.find((request) => request.status === status);
    if (match) {
      return match;
    }
  }

  return null;
}

function toFeaturedRequest(row: RequestRow): FeaturedRequest {
  const documentType = one(row.document_types);
  const appointment = one(row.appointments);

  return {
    id: row.id,
    requestNumber: row.request_number,
    documentName: documentType?.name ?? "Registrar document",
    status: row.status,
    appointmentLabel: appointment
      ? formatAppointmentSlot(
          appointment.appointment_date,
          appointment.appointment_time
        )
      : null,
    updatedLabel: formatDateTime(row.updated_at),
  };
}

export async function getStudentDashboardData(
  studentId: string
): Promise<StudentDashboardData> {
  const supabase = await createSupabaseServerClient();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
  }).format(new Date());

  const [requestsResult, upcomingResult] = await Promise.all([
    supabase
      .from("document_requests")
      .select(
        "id, request_number, status, updated_at, document_types(name), appointments(appointment_date, appointment_time, status)"
      )
      .eq("student_id", studentId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("appointments")
      .select("appointment_date, appointment_time")
      .eq("student_id", studentId)
      .in("status", ["scheduled", "checked_in"])
      .gte("appointment_date", today)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })
      .limit(1),
  ]);

  if (requestsResult.error) {
    throw new Error(`Unable to load requests: ${requestsResult.error.message}`);
  }

  if (upcomingResult.error) {
    throw new Error(
      `Unable to load appointments: ${upcomingResult.error.message}`
    );
  }

  const requests = requestsResult.data as RequestRow[];
  const upcoming = upcomingResult.data[0] ?? null;
  const featured = pickFeatured(requests);

  return {
    stats: {
      activeRequests: requests.filter((request) =>
        isActiveRequestStatus(request.status)
      ).length,
      readyForPickup: requests.filter(
        (request) => request.status === "ready_for_pickup"
      ).length,
      completedRequests: requests.filter(
        (request) => request.status === "completed"
      ).length,
      upcomingAppointment: upcoming
        ? formatAppointmentSlot(
            upcoming.appointment_date,
            upcoming.appointment_time
          )
        : null,
    },
    featuredRequest: featured ? toFeaturedRequest(featured) : null,
  };
}
