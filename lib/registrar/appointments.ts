import "server-only";

import {
  APPOINTMENT_SELECT,
  toAppointmentRecord,
  type AppointmentQueryRow,
} from "@/lib/appointments/query";
import {
  emptyAppointmentStats,
  summarizeAppointments,
  type AppointmentFilter,
  type AppointmentRecord,
  type AppointmentStats,
} from "@/lib/appointments/types";
import { addCalendarDays, schoolCalendarDate } from "@/lib/format/datetime";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type RegistrarAppointmentData = {
  appointments: AppointmentRecord[];
  todayStats: AppointmentStats;
  filter: AppointmentFilter;
};

export async function getRegistrarAppointments(
  filter: AppointmentFilter
): Promise<RegistrarAppointmentData> {
  const supabase = await createSupabaseServerClient();
  const today = schoolCalendarDate();
  const tomorrow = addCalendarDays(today, 1);

  const [listResult, todayResult] = await Promise.all([
    supabase
      .from("appointments")
      .select(APPOINTMENT_SELECT)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true }),
    supabase
      .from("appointments")
      .select("status")
      .eq("appointment_date", today),
  ]);

  if (listResult.error) {
    throw new Error(`Unable to load appointments: ${listResult.error.message}`);
  }

  if (todayResult.error) {
    throw new Error(
      `Unable to load appointment stats: ${todayResult.error.message}`
    );
  }

  const records = ((listResult.data ?? []) as AppointmentQueryRow[]).map((row) =>
    toAppointmentRecord(row)
  );

  return {
    filter,
    appointments: records.filter((row) => {
      if (filter === "today") return row.date === today;
      if (filter === "tomorrow") return row.date === tomorrow;
      if (filter === "upcoming") {
        return (
          row.date >= today &&
          (row.status === "scheduled" || row.status === "checked_in")
        );
      }
      if (filter === "completed") return row.status === "completed";
      return row.status === "cancelled";
    }),
    todayStats: summarizeAppointments(todayResult.data ?? []) ?? emptyAppointmentStats(),
  };
}
