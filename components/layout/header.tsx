import { NotificationBell } from "@/components/notifications/notification-bell";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import type { NavItem } from "@/lib/navigation";
import type { NotificationInbox } from "@/lib/notifications/types";
import type { AppUser } from "@/lib/roles";

type HeaderProps = {
  title: string;
  navigation: NavItem[];
  user?: AppUser | null;
  inbox?: NotificationInbox;
  showDrawer?: boolean;
};

export function Header({
  title,
  navigation,
  user,
  inbox,
  showDrawer = true,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex min-h-14 items-center gap-2 border-b bg-background/92 px-3 pt-[env(safe-area-inset-top)] shadow-xs backdrop-blur-sm md:gap-3 md:px-6 print:hidden">
      {showDrawer ? <MobileNav navigation={navigation} user={user} /> : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-medium tracking-tight md:text-base">
          {title}
        </h1>
      </div>
      <div className="flex items-center">
        {user && inbox ? (
          <NotificationBell inbox={inbox} role={user.role} />
        ) : null}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
        {user ? <UserMenu user={user} /> : null}
      </div>
    </header>
  );
}
