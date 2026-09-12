import "server-only";

import {
  addCalendarDays,
  formatShortCalendarDate,
  schoolCalendarDate,
  schoolDayBounds,
  toSchoolCalendarDate,
} from "@/lib/format/datetime";
import { boardFromEntries } from "@/lib/queue/query";
import {
  REQUEST_STATUS_LABELS,
  REQUEST_STATUSES,
  type AppointmentStatus,
  type QueueStatus,
  type RequestStatus,
} from "@/lib/status";
import type { RegistrarDashboardData } from "@/lib/registrar/dashboard-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type {
  DocumentTypePoint,
  RegistrarDashboardData,
  RegistrarDashboardStats,
  RegistrarTodayWindow,
  StatusSlice,
  VolumePoint,
} from "@/lib/registrar/dashboard-types";

const PENDING_STATUSES: RequestStatus[] = ["submitted", "under_review"];
const STATUS_CHART_COLORS: Record<RequestStatus, string> = {
  submitted: "var(--status-submitted)",
  under_review: "var(--status-under-review)",
  processing: "var(--status-processing)",
  ready_for_pickup: "var(--status-ready)",
  completed: "var(--status-completed)",
  rejected: "var(--status-rejected)",
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function countExact(count: number | null): number {
  return count ?? 0;
}

export async function getRegistrarDashboardData(): Promise<RegistrarDashboardData> {
  const supabase = await createSupabaseServerClient();
  const today = schoolCalendarDate();
  const { start: todayStart, end: todayEnd } = schoolDayBounds(today);
  const monthStart = schoolDayBounds(addCalendarDays(today, -29)).start;
  const volumeDates = Array.from({ length: 7 }, (_, index) =>
    addCalendarDays(today, index - 6)
  );

  const [
    todaysRequests,
    pendingRequests,
    processing,
    readyForPickup,
    completedToday,
    statuses,
    recentRequests,
    queueEntries,
    appointmentsToday,
  ] = await Promise.all([
    supabase
      .from("document_requests")
      .select("id", { count: "exact", head: true })
      .gte("submitted_at", todayStart)
      .lt("submitted_at", todayEnd),
    supabase
      .from("document_requests")
      .select("id", { count: "exact", head: true })
      .in("status", PENDING_STATUSES),
    supabase
      .from("document_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "processing"),
    supabase
      .from("document_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "ready_for_pickup"),
    supabase
      .from("document_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed")
      .gte("completed_at", todayStart)
      .lt("completed_at", todayEnd),
    supabase.from("document_requests").select("status"),
    supabase
      .from("document_requests")
      .select("submitted_at, document_types(name)")
      .gte("submitted_at", monthStart),
    supabase
      .from("queue_entries")
      .select("id, queue_date, queue_number, status, called_at, completed_at, request_id")
      .eq("queue_date", today),
    supabase
      .from("appointments")
      .select("status")
      .eq("appointment_date", today),
  ]);

  const failed = [
    todaysRequests.error,
    pendingRequests.error,
    processing.error,
    readyForPickup.error,
    completedToday.error,
    statuses.error,
    recentRequests.error,
    queueEntries.error,
    appointmentsToday.error,
  ].find(Boolean);

  if (failed) {
    throw new Error(`Unable to load the registrar dashboard: ${failed.message}`);
  }

  const statusCounts = REQUEST_STATUSES.reduce(
    (counts, status) => {
      counts[status] = 0;
      return counts;
    },
    {} as Record<RequestStatus, number>
  );

  for (const row of statuses.data ?? []) {
    statusCounts[row.status as RequestStatus] += 1;
  }

  const volumeCounts = new Map(volumeDates.map((date) => [date, 0]));
  const typeCounts = new Map<string, number>();

  for (const row of recentRequests.data ?? []) {
    const submittedDate = toSchoolCalendarDate(row.submitted_at);
    if (volumeCounts.has(submittedDate)) {
      volumeCounts.set(submittedDate, (volumeCounts.get(submittedDate) ?? 0) + 1);
    }

    const documentName =
      one(row.document_types as { name: string } | { name: string }[] | null)?.name ??
      "Registrar document";
    typeCounts.set(documentName, (typeCounts.get(documentName) ?? 0) + 1);
  }

  const board = boardFromEntries(
    today,
    (queueEntries.data ?? []).map((row) => ({
      id: row.id,
      date: row.queue_date,
      number: row.queue_number,
      status: row.status as QueueStatus,
      calledAt: row.called_at,
      completedAt: row.completed_at,
      studentName: "",
      studentId: null,
      requestId: row.request_id,
      requestNumber: null,
      documentName: null,
    }))
  );

  const appointmentRows = (appointmentsToday.data ?? []) as Array<{
    status: AppointmentStatus;
  }>;

  return {
    stats: {
      todaysRequests: countExact(todaysRequests.count),
      pendingRequests: countExact(pendingRequests.count),
      processing: countExact(processing.count),
      readyForPickup: countExact(readyForPickup.count),
      completedToday: countExact(completedToday.count),
    },
    today: {
      servingNumber: board.servingNumber,
      waitingCount: board.waitingCount,
      appointmentsToday: appointmentRows.length,
      appointmentsOpen: appointmentRows.filter(
        (row) => row.status === "scheduled" || row.status === "checked_in"
      ).length,
    },
    volume: volumeDates.map((date) => ({
      date,
      label: formatShortCalendarDate(date),
      count: volumeCounts.get(date) ?? 0,
    })),
    statusDistribution: REQUEST_STATUSES.flatMap((status) => {
      const count = statusCounts[status];
      return count > 0
        ? [
            {
              status,
              label: REQUEST_STATUS_LABELS[status],
              count,
              color: STATUS_CHART_COLORS[status],
            },
          ]
        : [];
    }),
    documentTypes: [...typeCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
  };
}
