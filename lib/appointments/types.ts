import type { AppointmentStatus } from "@/lib/status";

export const APPOINTMENT_FILTERS = [
  "today",
  "tomorrow",
  "upcoming",
  "completed",
  "cancelled",
] as const;

export type AppointmentFilter = (typeof APPOINTMENT_FILTERS)[number];

export const APPOINTMENT_FILTER_LABELS: Record<AppointmentFilter, string> = {
  today: "Today",
  tomorrow: "Tomorrow",
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function parseAppointmentFilter(
  value?: string
): AppointmentFilter {
  return APPOINTMENT_FILTERS.includes(value as AppointmentFilter)
    ? (value as AppointmentFilter)
    : "upcoming";
}

export type AppointmentRecord = {
  id: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  studentName: string;
  studentId: string | null;
  requestNumber: string | null;
  documentName: string | null;
};

export type AppointmentStats = {
  total: number;
  scheduled: number;
  checkedIn: number;
  completed: number;
  cancelled: number;
  missed: number;
};

export function emptyAppointmentStats(): AppointmentStats {
  return {
    total: 0,
    scheduled: 0,
    checkedIn: 0,
    completed: 0,
    cancelled: 0,
    missed: 0,
  };
}

export function summarizeAppointments(
  rows: Array<{ status: AppointmentStatus }>
): AppointmentStats {
  return rows.reduce((stats, row) => {
    stats.total += 1;

    if (row.status === "scheduled") stats.scheduled += 1;
    if (row.status === "checked_in") stats.checkedIn += 1;
    if (row.status === "completed") stats.completed += 1;
    if (row.status === "cancelled") stats.cancelled += 1;
    if (row.status === "missed") stats.missed += 1;

    return stats;
  }, emptyAppointmentStats());
}
