"use server";

import { revalidatePath } from "next/cache";

import { getAuthContext } from "@/lib/auth/session";
import {
  canTransitionAppointment,
  type AppointmentStatus,
} from "@/lib/status";
import { isStaffRole } from "@/lib/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function toAppointmentError(message: string): string {
  if (message.includes("Invalid appointment status transition")) {
    return "That appointment status change is not allowed.";
  }

  return "We could not update the appointment. Please try again.";
}

function revalidateAppointmentViews() {
  revalidatePath("/student/appointments");
  revalidatePath("/student/dashboard");
  revalidatePath("/registrar/appointments");
}

export async function cancelStudentAppointment(
  appointmentId: string
): Promise<{ ok: true } | { error: string }> {
  const context = await getAuthContext();

  if (!context || context.profile.role !== "student") {
    return { error: "You must be signed in as a student." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: current, error: loadError } = await supabase
    .from("appointments")
    .select("id, status, student_id")
    .eq("id", appointmentId)
    .eq("student_id", context.userId)
    .maybeSingle();

  if (loadError || !current) {
    return { error: "We could not find that appointment." };
  }

  if (current.status !== "scheduled") {
    return { error: "Only a scheduled appointment can be cancelled." };
  }

  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", current.id)
    .eq("student_id", context.userId)
    .eq("status", "scheduled")
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: toAppointmentError(error.message) };
  }

  if (!data) {
    return { error: "We could not cancel that appointment." };
  }

  revalidateAppointmentViews();
  return { ok: true };
}

export async function updateStaffAppointmentStatus(
  appointmentId: string,
  nextStatus: AppointmentStatus
): Promise<{ ok: true } | { error: string }> {
  const context = await getAuthContext();

  if (!context || !isStaffRole(context.profile.role)) {
    return { error: "You must be signed in as registrar staff." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: current, error: loadError } = await supabase
    .from("appointments")
    .select("id, status")
    .eq("id", appointmentId)
    .maybeSingle();

  if (loadError || !current) {
    return { error: "We could not find that appointment." };
  }

  if (!canTransitionAppointment(current.status, nextStatus)) {
    return { error: "That appointment status change is not allowed." };
  }

  const { data, error } = await supabase
    .from("appointments")
    .update({ status: nextStatus })
    .eq("id", current.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: toAppointmentError(error.message) };
  }

  if (!data) {
    return { error: "We could not update that appointment." };
  }

  revalidateAppointmentViews();
  return { ok: true };
}
