import {
  Bell,
  CalendarClock,
  FileSearch,
  PackageCheck,
} from "lucide-react";

import { formatDateTime, formatRelativeTime } from "@/lib/format/datetime";
import type { NotificationRecord, NotificationType } from "@/lib/notifications/types";
import { cn } from "@/lib/utils";

const notificationIcons: Record<NotificationType, typeof Bell> = {
  request_update: FileSearch,
  ready_for_pickup: PackageCheck,
  appointment: CalendarClock,
  system: Bell,
};

type NotificationItemProps = {
  notification: NotificationRecord;
  compact?: boolean;
};

export function NotificationItem({
  notification,
  compact = false,
}: NotificationItemProps) {
  const Icon = notificationIcons[notification.type];

  return (
    <div className="flex min-w-0 items-start gap-3">
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border",
          notification.isRead
            ? "bg-muted text-muted-foreground"
            : "bg-primary/10 text-primary"
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              "text-sm",
              notification.isRead ? "font-medium" : "font-semibold"
            )}
          >
            {notification.title}
          </p>
          {notification.isRead ? null : (
            <span
              aria-label="Unread"
              className="mt-1 size-2 shrink-0 rounded-full bg-primary"
            />
          )}
        </div>
        <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
          {notification.message}
        </p>
        <p className="mt-1 text-caption">
          {compact
            ? formatRelativeTime(notification.createdAt)
            : formatDateTime(notification.createdAt)}
        </p>
      </div>
    </div>
  );
}
