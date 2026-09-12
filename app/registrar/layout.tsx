import { AppShell } from "@/components/layout/app-shell";
import {
  getRequestPathname,
  requireStaffContext,
  toAppUser,
} from "@/lib/auth/session";
import { getNotificationInbox } from "@/lib/notifications/query";
import { registrarNavigation, titleForPath } from "@/lib/navigation";

export default async function RegistrarLayout({
  children,
}: LayoutProps<"/registrar">) {
  const context = await requireStaffContext();
  const pathname = await getRequestPathname();
  const inbox = await getNotificationInbox(context.userId);

  return (
    <AppShell
      title={
        pathname.startsWith("/registrar/notifications")
          ? "Notifications"
          : titleForPath(pathname, registrarNavigation, "Registrar portal")
      }
      navigation={registrarNavigation}
      user={toAppUser(context.profile)}
      inbox={inbox}
    >
      {children}
    </AppShell>
  );
}
