import "server-only";

import type {
  NotificationInbox,
  NotificationRecord,
} from "@/lib/notifications/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const NOTIFICATION_SELECT =
  "id, title, message, type, is_read, created_at, request_id";

function toNotification(row: {
  id: string;
  title: string;
  message: string;
  type: NotificationRecord["type"];
  is_read: boolean;
  created_at: string;
  request_id: string | null;
}): NotificationRecord {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type,
    isRead: row.is_read,
    createdAt: row.created_at,
    requestId: row.request_id,
  };
}

export async function getNotificationInbox(
  userId: string
): Promise<NotificationInbox> {
  const supabase = await createSupabaseServerClient();
  const [recentResult, unreadResult] = await Promise.all([
    supabase
      .from("notifications")
      .select(NOTIFICATION_SELECT)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false),
  ]);

  if (recentResult.error) {
    throw new Error(
      `Unable to load notifications: ${recentResult.error.message}`
    );
  }

  if (unreadResult.error) {
    throw new Error(
      `Unable to load unread notifications: ${unreadResult.error.message}`
    );
  }

  return {
    unreadCount: unreadResult.count ?? 0,
    recent: (recentResult.data ?? []).map(toNotification),
  };
}

export async function getUserNotifications(
  userId: string
): Promise<NotificationRecord[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("notifications")
    .select(NOTIFICATION_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(`Unable to load notifications: ${error.message}`);
  }

  return (data ?? []).map(toNotification);
}
