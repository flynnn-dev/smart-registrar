import type { Metadata } from "next";

import { NotificationPage } from "@/components/notifications/notification-page";
import { requireStudentContext } from "@/lib/auth/session";
import { getUserNotifications } from "@/lib/notifications/query";

export const metadata: Metadata = {
  title: "Notifications",
};

export const dynamic = "force-dynamic";

type StudentNotificationsPageProps = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

export default async function StudentNotificationsPage({
  searchParams,
}: StudentNotificationsPageProps) {
  const { userId, profile } = await requireStudentContext();
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
