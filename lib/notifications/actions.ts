"use server";

import { revalidatePath } from "next/cache";

import { getAuthContext } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function revalidateNotificationViews() {
  revalidatePath("/student", "layout");
  revalidatePath("/registrar", "layout");
  revalidatePath("/student/notifications");
  revalidatePath("/registrar/notifications");
}

export async function markNotificationRead(
  notificationId: string
): Promise<{ ok: true } | { error: string }> {
  const context = await getAuthContext();

  if (!context) {
    return { error: "You must be signed in." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", context.userId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: "We could not update that notification." };
  }

  if (!data) {
    return { error: "We could not find that notification." };
  }

  revalidateNotificationViews();
  return { ok: true };
}

export async function markAllNotificationsRead(): Promise<
  { ok: true } | { error: string }
> {
  const context = await getAuthContext();

  if (!context) {
    return { error: "You must be signed in." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", context.userId)
    .eq("is_read", false);

  if (error) {
    return { error: "We could not mark your notifications as read." };
  }

  revalidateNotificationViews();
  return { ok: true };
}
