"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { NotificationItem } from "@/components/notifications/notification-item";
import { markNotificationRead } from "@/lib/notifications/actions";
import { notificationTargetPath } from "@/lib/notifications/paths";
import type { NotificationRecord } from "@/lib/notifications/types";
import type { UserRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

type NotificationListProps = {
  notifications: NotificationRecord[];
  role: UserRole;
};

export function NotificationList({
  notifications,
  role,
}: NotificationListProps) {
  const router = useRouter();

  return (
    <ul className="divide-y rounded-xl border bg-card">
      {notifications.map((notification) => (
        <li key={notification.id}>
          <button
            type="button"
            className={cn(
              "w-full px-4 py-4 text-left transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
              !notification.isRead && "bg-primary/4"
            )}
            onClick={() => {
              void (async () => {
                router.push(
                  notificationTargetPath(role, notification.requestId)
                );
                const result = await markNotificationRead(notification.id);
                if ("error" in result) {
                  toast.error(result.error);
                }
                router.refresh();
              })();
            }}
          >
            <NotificationItem notification={notification} />
          </button>
        </li>
      ))}
    </ul>
  );
}
