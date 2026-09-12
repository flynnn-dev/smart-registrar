import { Logo } from "@/components/layout/logo";
import { NavItems } from "@/components/layout/nav-items";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { NavItem } from "@/lib/navigation";
import { getInitials, ROLE_LABELS, type AppUser } from "@/lib/roles";

type SidebarProps = {
  navigation: NavItem[];
  user?: AppUser | null;
};

export function Sidebar({ navigation, user }: SidebarProps) {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex print:hidden">
      <div className="flex h-14 shrink-0 items-center px-4">
        <Logo />
      </div>
      <Separator />
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <NavItems items={navigation} />
      </div>
      <Separator />
      <div className="flex shrink-0 items-center gap-2 p-3">
        {user ? (
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <Avatar size="sm">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt="" />
              ) : null}
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.name}
              </p>
              <Badge variant="secondary" className="mt-0.5 h-4 px-1.5 text-[10px]">
                {ROLE_LABELS[user.role]}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Not signed in</p>
          </div>
        )}
      </div>
    </aside>
  );
}
