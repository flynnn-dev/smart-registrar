import {
  addCalendarDays,
  formatReportDate,
  schoolCalendarDate,
  schoolDayBounds,
  startOfSchoolMonth,
  startOfSchoolWeek,
} from "@/lib/format/datetime";
import {
  REPORT_PERIODS,
  type ReportPeriod,
  type StaffReportFilters,
} from "@/lib/registrar/report-types";

const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MAX_RANGE_DAYS = 366;

export function isCalendarDate(value?: string): value is string {
  if (!value || !CALENDAR_DATE.test(value)) {
    return false;
  }

  const [, year, month, day] = value.match(CALENDAR_DATE) ?? [];
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  const utcNoon = new Date(Date.UTC(y, m - 1, d, 12));

  return (
    utcNoon.getUTCFullYear() === y &&
    utcNoon.getUTCMonth() === m - 1 &&
    utcNoon.getUTCDate() === d
  );
}

export function parseReportPeriod(value?: string): ReportPeriod {
  return REPORT_PERIODS.includes(value as ReportPeriod)
    ? (value as ReportPeriod)
    : "month";
}

function clampRange(from: string, to: string): { from: string; to: string } {
  const start = from <= to ? from : to;
  const end = from <= to ? to : from;
  const earliest = addCalendarDays(end, -(MAX_RANGE_DAYS - 1));

  return { from: start < earliest ? earliest : start, to: end };
}

export function parseStaffReportFilters(input: {
  period?: string;
  from?: string;
  to?: string;
}): StaffReportFilters {
  const today = schoolCalendarDate();
  const period = parseReportPeriod(input.period);

  if (period === "today") {
    return { period, from: today, to: today };
  }

  if (period === "week") {
    return { period, from: startOfSchoolWeek(today), to: today };
  }

  if (period === "month") {
    return { period, from: startOfSchoolMonth(today), to: today };
  }

  const from = isCalendarDate(input.from) ? input.from : startOfSchoolMonth(today);
  const to = isCalendarDate(input.to) ? input.to : today;
  const range = clampRange(from, to > today ? today : to);

  return { period: "custom", ...range };
}

export function reportDayBounds(filters: StaffReportFilters): {
  start: string;
  end: string;
} {
  return {
    start: schoolDayBounds(filters.from).start,
    end: schoolDayBounds(addCalendarDays(filters.to, 1)).start,
  };
}

export function eachCalendarDate(from: string, to: string): string[] {
  const dates: string[] = [];
  let cursor = from;

  while (cursor <= to) {
    dates.push(cursor);
    cursor = addCalendarDays(cursor, 1);
  }

  return dates;
}

export function reportRangeLabel(from: string, to: string): string {
  if (from === to) {
    return formatReportDate(from);
  }

  return `${formatReportDate(from)} – ${formatReportDate(to)}`;
}

export function staffReportsHref(
  filters: Partial<StaffReportFilters>
): string {
  const params = new URLSearchParams();

  if (filters.period && filters.period !== "month") {
    params.set("period", filters.period);
  }

  if (filters.period === "custom") {
    if (filters.from) {
      params.set("from", filters.from);
    }
    if (filters.to) {
      params.set("to", filters.to);
    }
  }

  const query = params.toString();
  return query ? `/registrar/reports?${query}` : "/registrar/reports";
}
