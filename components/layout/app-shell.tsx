import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import type { NavItem } from "@/lib/navigation";
import type { NotificationInbox } from "@/lib/notifications/types";
import type { AppUser } from "@/lib/roles";

type AppShellProps = {
  title: string;
  navigation: NavItem[];
  user?: AppUser | null;
  inbox?: NotificationInbox;
  children: React.ReactNode;
};

export function AppShell({
  title,
  navigation,
  user,
  inbox,
  children,
}: AppShellProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background print:h-auto print:overflow-visible">
      <Sidebar navigation={navigation} user={user} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header title={title} navigation={navigation} user={user} inbox={inbox} />
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-8 md:py-8 print:overflow-visible print:px-0 print:py-0 print:pb-0">
          <div className="mx-auto w-full max-w-6xl print:max-w-none">{children}</div>
        </main>
      </div>
    </div>
  );
}
