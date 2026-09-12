import "server-only";

import {
  addCalendarDays,
  formatMonthYear,
  formatShortCalendarDate,
  schoolDayBounds,
  startOfSchoolMonth,
  toSchoolCalendarDate,
} from "@/lib/format/datetime";
import {
  eachCalendarDate,
  reportDayBounds,
  reportRangeLabel,
} from "@/lib/registrar/report-filters";
import type {
  ReportRequestRow,
  StaffReportData,
  StaffReportFilters,
} from "@/lib/registrar/report-types";
import {
  REQUEST_STATUS_LABELS,
  REQUEST_STATUSES,
  type RequestStatus,
} from "@/lib/status";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const REPORT_ROW_LIMIT = 500;
const MONTHLY_VOLUME_AFTER_DAYS = 45;
const PENDING_STATUSES: RequestStatus[] = ["submitted", "under_review"];

const STATUS_CHART_COLORS: Record<RequestStatus, string> = {
  submitted: "var(--status-submitted)",
  under_review: "var(--status-under-review)",
  processing: "var(--status-processing)",
  ready_for_pickup: "var(--status-ready)",
  completed: "var(--status-completed)",
  rejected: "var(--status-rejected)",
};

type ProfileEmbed = {
  id?: string;
  full_name: string | null;
  student_id: string | null;
};

type ReportRow = {
  id: string;
  request_number: string;
  status: RequestStatus;
  submitted_at: string;
  student_id: string;
  document_types: { name: string } | { name: string }[] | null;
  profiles: ProfileEmbed | ProfileEmbed[] | null;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function monthBounds(dateInMonth: string): { start: string; end: string } {
  const monthStart = startOfSchoolMonth(dateInMonth);
  const nextMonth = `${addCalendarDays(monthStart, 32).slice(0, 7)}-01`;

  return {
    start: schoolDayBounds(monthStart).start,
    end: schoolDayBounds(nextMonth).start,
  };
}

function toRequest(row: ReportRow): ReportRequestRow {
  const student = one(row.profiles);

  return {
    id: row.id,
    requestNumber: row.request_number,
    documentName: one(row.document_types)?.name ?? "Registrar document",
    status: row.status,
    submittedAt: row.submitted_at,
    studentUserId: student?.id ?? row.student_id,
    studentName: student?.full_name?.trim() || null,
    studentCampusId: student?.student_id ?? null,
  };
}

export async function getStaffReportData(
  filters: StaffReportFilters
): Promise<StaffReportData> {
  const supabase = await createSupabaseServerClient();
  const bounds = reportDayBounds(filters);
  const month = monthBounds(filters.to);
  const dates = eachCalendarDate(filters.from, filters.to);
  const useMonthlyVolume = dates.length > MONTHLY_VOLUME_AFTER_DAYS;

  const [periodResult, monthResult] = await Promise.all([
    supabase
      .from("document_requests")
      .select(
        "id, request_number, status, submitted_at, student_id, document_types(name), profiles!document_requests_student_id_fkey(id, full_name, student_id)",
        { count: "exact" }
      )
      .gte("submitted_at", bounds.start)
      .lt("submitted_at", bounds.end)
      .order("submitted_at", { ascending: false })
      .range(0, REPORT_ROW_LIMIT - 1),
    supabase
      .from("document_requests")
      .select("id", { count: "exact", head: true })
      .gte("submitted_at", month.start)
      .lt("submitted_at", month.end),
  ]);

  if (periodResult.error) {
    throw new Error(`Unable to load the report: ${periodResult.error.message}`);
  }

  if (monthResult.error) {
    throw new Error(
      `Unable to load monthly request totals: ${monthResult.error.message}`
    );
  }

  const rows = (periodResult.data ?? []) as ReportRow[];
  const requests = rows.map(toRequest);
  const total = periodResult.count ?? requests.length;
  const statusCounts = REQUEST_STATUSES.reduce(
    (counts, status) => {
      counts[status] = 0;
      return counts;
    },
    {} as Record<RequestStatus, number>
  );
  const typeCounts = new Map<string, number>();
  const dailyCounts = new Map(dates.map((date) => [date, 0]));
  const monthlyCounts = new Map<string, number>();

  for (const request of requests) {
    statusCounts[request.status] += 1;
    typeCounts.set(
      request.documentName,
      (typeCounts.get(request.documentName) ?? 0) + 1
    );

    const submittedDate = toSchoolCalendarDate(request.submittedAt);
    if (dailyCounts.has(submittedDate)) {
      dailyCounts.set(submittedDate, (dailyCounts.get(submittedDate) ?? 0) + 1);
    }

    const monthKey = `${submittedDate.slice(0, 7)}-01`;
    monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) ?? 0) + 1);
  }

  const completed = statusCounts.completed;
  const pending = PENDING_STATUSES.reduce(
    (sum, status) => sum + statusCounts[status],
    0
  );
  const dailyIsAverage = dates.length > 1;
  const dailyRequests = dailyIsAverage
    ? Number((total / dates.length).toFixed(1))
    : total;

  const volume = useMonthlyVolume
    ? [...monthlyCounts.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({
          date,
          label: formatMonthYear(date),
          count,
        }))
    : dates.map((date) => ({
        date,
        label: formatShortCalendarDate(date),
        count: dailyCounts.get(date) ?? 0,
      }));

  return {
    rangeLabel: reportRangeLabel(filters.from, filters.to),
    startDate: filters.from,
    endDate: filters.to,
    generatedAt: new Date().toISOString(),
    volumeKind: useMonthlyVolume ? "monthly" : "daily",
    volume,
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
    requests,
    total,
    truncated: total > requests.length,
    stats: {
      dailyRequests,
      dailyIsAverage,
      monthlyRequests: monthResult.count ?? 0,
      completed,
      pending,
    },
  };
}
