"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { NotificationItem } from "@/components/notifications/notification-item";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications/actions";
import {
  notificationTargetPath,
  notificationsPathForRole,
} from "@/lib/notifications/paths";
import type { NotificationInbox } from "@/lib/notifications/types";
import type { UserRole } from "@/lib/roles";

type NotificationBellProps = {
  inbox: NotificationInbox;
  role: UserRole;
};

export function NotificationBell({ inbox, role }: NotificationBellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const inboxSignature = `${inbox.unreadCount}|${inbox.recent
    .map((item) => `${item.id}:${item.isRead}`)
    .join(",")}`;
  const [seenSignature, setSeenSignature] = useState(inboxSignature);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [markedAll, setMarkedAll] = useState(false);

  if (seenSignature !== inboxSignature) {
    setSeenSignature(inboxSignature);
    setReadIds([]);
    setMarkedAll(false);
  }

  const recent = useMemo(
    () =>
      inbox.recent.map((item) => ({
        ...item,
        isRead: markedAll || item.isRead || readIds.includes(item.id),
      })),
    [inbox.recent, markedAll, readIds]
  );
  const unreadCount = markedAll
    ? 0
    : Math.max(
        0,
        inbox.unreadCount -
          inbox.recent.filter(
            (item) => !item.isRead && readIds.includes(item.id)
          ).length
      );

  async function openNotification(id: string, requestId: string | null) {
    const target = notificationTargetPath(role, requestId);
    setReadIds((current) =>
      current.includes(id) ? current : [...current, id]
    );
    setOpen(false);
    router.push(target);

    const result = await markNotificationRead(id);
    if ("error" in result) {
      toast.error(result.error);
    }
    router.refresh();
  }

  async function markAllRead() {
    if (unreadCount === 0) {
      return;
    }

    setPending(true);
    setMarkedAll(true);

    const result = await markAllNotificationsRead();
    setPending(false);

    if ("error" in result) {
      toast.error(result.error);
      setMarkedAll(false);
      return;
    }

    toast.success("All notifications marked as read");
    router.refresh();
  }

  const unreadLabel =
    unreadCount === 0
      ? "Notifications"
      : `Notifications, ${unreadCount} unread`;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={unreadLabel}
          className="relative size-10 md:size-8"
        >
          <Bell className="size-4" />
          {unreadCount > 0 ? (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[min(20rem,calc(100vw-1.5rem))] p-0"
      >
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={pending || unreadCount === 0}
            onClick={() => {
              void markAllRead();
            }}
          >
            Mark all read
          </Button>
        </div>
        <DropdownMenuSeparator className="my-0" />
        {recent.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            You have no notifications yet.
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto py-1">
            {recent.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="cursor-pointer items-start rounded-none px-3 py-2.5"
                onSelect={(event) => {
                  event.preventDefault();
                  void openNotification(
                    notification.id,
                    notification.requestId
                  );
                }}
              >
                <NotificationItem notification={notification} compact />
              </DropdownMenuItem>
            ))}
          </div>
        )}
        <DropdownMenuSeparator className="my-0" />
        <DropdownMenuItem
          className="cursor-pointer justify-center py-2 text-sm font-medium"
          onSelect={(event) => {
            event.preventDefault();
            setOpen(false);
            router.push(notificationsPathForRole(role));
          }}
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
