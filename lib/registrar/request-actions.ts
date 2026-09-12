"use server";

import { revalidatePath } from "next/cache";

import { getAuthContext } from "@/lib/auth/session";
import { isStaffRole } from "@/lib/roles";
import { canTransitionRequest, type RequestStatus } from "@/lib/status";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function revalidateRequestViews(requestId: string) {
  revalidatePath("/registrar/requests");
  revalidatePath(`/registrar/requests/${requestId}`);
  revalidatePath("/registrar/dashboard");
  revalidatePath("/student/requests");
  revalidatePath(`/student/requests/${requestId}`);
  revalidatePath("/student/dashboard");
  revalidatePath("/student", "layout");
  revalidatePath("/registrar", "layout");
}

function toRequestError(message: string): string {
  if (message.includes("Invalid request status transition")) {
    return "That status change is not allowed.";
  }

  return "We could not update that request. Please try again.";
}

export async function updateStaffRequestStatus(
  requestId: string,
  nextStatus: RequestStatus,
  remarks?: string
): Promise<{ ok: true } | { error: string }> {
  const context = await getAuthContext();

  if (!context || !isStaffRole(context.profile.role)) {
    return { error: "You must be signed in as registrar staff." };
  }

  const note = remarks?.trim() ?? "";

  if (nextStatus === "rejected" && note.length === 0) {
    return { error: "Add a short note so the student knows what to correct." };
  }

  if (note.length > 500) {
    return { error: "Remarks must be 500 characters or fewer." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: current, error: loadError } = await supabase
    .from("document_requests")
    .select("id, status, remarks")
    .eq("id", requestId)
    .maybeSingle();

  if (loadError || !current) {
    return { error: "We could not find that request." };
  }

  if (!canTransitionRequest(current.status, nextStatus)) {
    return { error: "That status change is not allowed." };
  }

  if (current.status === nextStatus) {
    return { ok: true };
  }

  const { data, error } = await supabase
    .from("document_requests")
    .update({
      status: nextStatus,
      remarks: note || current.remarks,
    })
    .eq("id", current.id)
    .eq("status", current.status)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: toRequestError(error.message) };
  }

  if (!data) {
    return { error: "That request was updated by someone else. Refresh and try again." };
  }

  revalidateRequestViews(requestId);
  return { ok: true };
}
