import "server-only";

import {
  APPOINTMENT_SELECT,
  toAppointmentRecord,
  type AppointmentQueryRow,
} from "@/lib/appointments/query";
import type { AppointmentRecord } from "@/lib/appointments/types";
import { schoolCalendarDate } from "@/lib/format/datetime";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StudentAppointmentLists = {
  upcoming: AppointmentRecord[];
  past: AppointmentRecord[];
};

export async function getStudentAppointments(
  studentId: string,
  studentName: string
): Promise<StudentAppointmentLists> {
  const supabase = await createSupabaseServerClient();
  const today = schoolCalendarDate();
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_SELECT)
    .eq("student_id", studentId)
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });

  if (error) {
    throw new Error(`Unable to load appointments: ${error.message}`);
  }

  const records = ((data ?? []) as AppointmentQueryRow[]).map((row) =>
    toAppointmentRecord(row, studentName)
  );

  return {
    upcoming: records.filter(
      (row) =>
        row.date >= today &&
        (row.status === "scheduled" || row.status === "checked_in")
    ),
    past: records.filter(
      (row) =>
        row.date < today ||
        (row.status !== "scheduled" && row.status !== "checked_in")
    ),
  };
}
