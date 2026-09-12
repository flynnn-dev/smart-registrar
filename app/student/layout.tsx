import { AppShell } from "@/components/layout/app-shell";
import {
  getRequestPathname,
  requireStudentContext,
  toAppUser,
} from "@/lib/auth/session";
import { getNotificationInbox } from "@/lib/notifications/query";
import { studentNavigation, titleForPath } from "@/lib/navigation";

export default async function StudentLayout({
  children,
}: LayoutProps<"/student">) {
  const context = await requireStudentContext();
  const pathname = await getRequestPathname();
  const inbox = await getNotificationInbox(context.userId);

  return (
    <AppShell
      title={titleForPath(pathname, studentNavigation, "Student portal")}
      navigation={studentNavigation}
      user={toAppUser(context.profile)}
      inbox={inbox}
    >
      {children}
    </AppShell>
  );
}
