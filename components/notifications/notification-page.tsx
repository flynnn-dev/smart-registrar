import { Bell } from "lucide-react";

import { MarkAllReadButton } from "@/components/notifications/mark-all-read-button";
import { NotificationFilters } from "@/components/notifications/notification-filters";
import { NotificationList } from "@/components/notifications/notification-list";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  parseNotificationFilter,
  type NotificationRecord,
} from "@/lib/notifications/types";
import { isStaffRole, type UserRole } from "@/lib/roles";

type NotificationPageProps = {
  notifications: NotificationRecord[];
  role: UserRole;
  filter?: string;
};

export function NotificationPage({
  notifications,
  role,
  filter,
}: NotificationPageProps) {
  const current = parseNotificationFilter(filter);
  const href = isStaffRole(role)
    ? "/registrar/notifications"
    : "/student/notifications";
  const visible =
    current === "unread"
      ? notifications.filter((notification) => !notification.isRead)
      : notifications;
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notifications"
        description="Updates about your requests and registrar visits."
        actions={<MarkAllReadButton disabled={unreadCount === 0} />}
      />

      <NotificationFilters href={href} current={current} />

      {visible.length === 0 ? (
        <div className="surface-card">
          <EmptyState
            icon={Bell}
            title={
              current === "unread"
                ? "You're all caught up"
                : "No notifications yet"
            }
            description={
              current === "unread"
                ? "New updates will appear here when the registrar changes a request."
                : "You'll be notified when a request is reviewed or ready for pickup."
            }
          />
        </div>
      ) : (
        <NotificationList notifications={visible} role={role} />
      )}
    </div>
  );
}
