"use server";

import { revalidatePath } from "next/cache";

import { getAuthContext } from "@/lib/auth/session";
import { canTransitionQueue, type QueueStatus } from "@/lib/status";
import { isStaffRole } from "@/lib/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function toQueueError(message: string): string {
  if (message.includes("Invalid queue status transition")) {
    return "That queue status change is not allowed.";
  }

  if (message.includes("Complete or skip the current number first")) {
    return "Complete or skip the current number first.";
  }

  if (message.includes("No one is waiting in the queue")) {
    return "No one is waiting in the queue.";
  }

  if (
    message.includes("queue_entries_one_serving_per_day_uidx") ||
    message.includes("duplicate key")
  ) {
    return "Complete or skip the current number first.";
  }

  if (message.includes("Staff access required")) {
    return "You must be signed in as registrar staff.";
  }

  return "We could not update the queue. Please try again.";
}

function revalidateQueueViews() {
  revalidatePath("/student/queue");
  revalidatePath("/registrar/queue");
}

export async function callNextQueueEntry(
  date: string
): Promise<{ ok: true; number: string } | { error: string }> {
  const context = await getAuthContext();

  if (!context || !isStaffRole(context.profile.role)) {
    return { error: "You must be signed in as registrar staff." };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "We could not update the queue. Please try again." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("call_next_queue_entry", {
    p_date: date,
  });

  if (error) {
    return { error: toQueueError(error.message) };
  }

  const claimed = data?.[0];

  if (!claimed) {
    return { error: "No one is waiting in the queue." };
  }

  revalidateQueueViews();
  return { ok: true, number: claimed.queue_number };
}

export async function updateStaffQueueStatus(
  entryId: string,
  nextStatus: QueueStatus
): Promise<{ ok: true } | { error: string }> {
  const context = await getAuthContext();

  if (!context || !isStaffRole(context.profile.role)) {
    return { error: "You must be signed in as registrar staff." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: current, error: loadError } = await supabase
    .from("queue_entries")
    .select("id, status")
    .eq("id", entryId)
    .maybeSingle();

  if (loadError || !current) {
    return { error: "We could not find that queue number." };
  }

  if (!canTransitionQueue(current.status, nextStatus)) {
    return { error: "That queue status change is not allowed." };
  }

  const { data, error } = await supabase
    .from("queue_entries")
    .update({ status: nextStatus })
    .eq("id", current.id)
    .eq("status", current.status)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: toQueueError(error.message) };
  }

  if (!data) {
    return { error: "We could not update that queue number." };
  }

  revalidateQueueViews();
  return { ok: true };
}
