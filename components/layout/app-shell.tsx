import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { StudentTabBar } from "@/components/layout/student-tab-bar";
import type { NavItem } from "@/lib/navigation";
import type { NotificationInbox } from "@/lib/notifications/types";
import type { AppUser } from "@/lib/roles";
import { cn } from "@/lib/utils";

type AppShellProps = {
  title: string;
  navigation: NavItem[];
  user?: AppUser | null;
  inbox?: NotificationInbox;
  mobileNav?: "drawer" | "tabs";
  children: React.ReactNode;
};

export function AppShell({
  title,
  navigation,
  user,
  inbox,
  mobileNav = "drawer",
  children,
}: AppShellProps) {
  const useTabs = mobileNav === "tabs";

  return (
    <div
      className={cn(
        "flex h-dvh overflow-hidden bg-background [--app-tabbar:0px] print:h-auto print:overflow-visible",
        useTabs &&
          "max-md:[--app-tabbar:calc(3.75rem+env(safe-area-inset-bottom))]"
      )}
    >
      <Sidebar navigation={navigation} user={user} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header
          title={title}
          navigation={navigation}
          user={user}
          inbox={inbox}
          showDrawer={!useTabs}
        />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-6 pb-[max(1.5rem,calc(var(--app-tabbar)+0.75rem))] md:px-8 md:py-8 print:overflow-visible print:px-0 print:py-0 print:pb-0">
          <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col print:max-w-none">
            {children}
          </div>
        </main>
      </div>
      {useTabs ? <StudentTabBar /> : null}
    </div>
  );
}
