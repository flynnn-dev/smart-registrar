import type { Database } from "@/lib/supabase/database";

export type NotificationType = Database["public"]["Enums"]["notification_type"];

export const NOTIFICATION_FILTERS = ["all", "unread"] as const;

export type NotificationFilter = (typeof NOTIFICATION_FILTERS)[number];

export const NOTIFICATION_FILTER_LABELS: Record<NotificationFilter, string> = {
  all: "All",
  unread: "Unread",
};

export function parseNotificationFilter(value?: string): NotificationFilter {
  return NOTIFICATION_FILTERS.includes(value as NotificationFilter)
    ? (value as NotificationFilter)
    : "all";
}

export type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  requestId: string | null;
};

export type NotificationInbox = {
  unreadCount: number;
  recent: NotificationRecord[];
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  request_update: "Request",
  ready_for_pickup: "Pickup",
  appointment: "Appointment",
  system: "System",
};
