"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navIcons } from "@/components/layout/nav-items";
import { matchNavItem, studentTabNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function StudentTabBar() {
  const pathname = usePathname();
  const activeHref = matchNavItem(pathname, studentTabNavigation)?.href;

  return (
    <nav
      aria-label="Student"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t bg-background/95 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 shadow-[0_-8px_24px_-16px_oklch(0.23_0.03_264/0.18)] backdrop-blur-sm md:hidden print:hidden"
    >
      {studentTabNavigation.map((item) => {
        const Icon = navIcons[item.icon];
        const active = activeHref === item.href;
        const isNew = item.icon === "requestNew";

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-0.5 px-1 text-[10px] leading-none font-medium",
              "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
              active
                ? "text-primary"
                : isNew
                  ? "text-primary/80"
                  : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
