"use client";

import {
  BarChart3,
  Bell,
  CalendarDays,
  ClipboardList,
  FilePlus2,
  FileStack,
  LayoutDashboard,
  ReceiptText,
  Settings,
  Ticket,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { matchNavItem, type NavIconName, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export const navIcons: Record<NavIconName, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  requestNew: FilePlus2,
  requests: ClipboardList,
  appointments: CalendarDays,
  notifications: Bell,
  profile: UserRound,
  queue: Ticket,
  students: Users,
  documents: FileStack,
  reports: BarChart3,
  transactions: ReceiptText,
  settings: Settings,
};

type NavItemsProps = {
  items: NavItem[];
  onNavigate?: () => void;
};

export function NavItems({ items, onNavigate }: NavItemsProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex flex-col gap-0.5">
      {items.map((item) => {
        const Icon = navIcons[item.icon];
        const isActive = matchNavItem(pathname, items)?.href === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm motion-safe:transition-colors md:min-h-9 md:py-2",
              "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
              isActive
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
