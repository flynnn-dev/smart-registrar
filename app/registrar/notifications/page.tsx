import type { Metadata } from "next";

import { NotificationPage } from "@/components/notifications/notification-page";
import { requireStaffContext } from "@/lib/auth/session";
import { getUserNotifications } from "@/lib/notifications/query";

export const metadata: Metadata = {
  title: "Notifications",
};

export const dynamic = "force-dynamic";

type RegistrarNotificationsPageProps = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

export default async function RegistrarNotificationsPage({
  searchParams,
}: RegistrarNotificationsPageProps) {
  const { userId, profile } = await requireStaffContext();
  const { filter } = await searchParams;
  const notifications = await getUserNotifications(userId);

  return (
    <NotificationPage
      notifications={notifications}
      role={profile.role}
      filter={filter}
    />
  );
}
