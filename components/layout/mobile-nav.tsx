"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/layout/logo";
import { NavItems } from "@/components/layout/nav-items";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { NavItem } from "@/lib/navigation";
import { getInitials, ROLE_LABELS, type AppUser } from "@/lib/roles";

type MobileNavProps = {
  navigation: NavItem[];
  user?: AppUser | null;
};

export function MobileNav({ navigation, user }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-10 md:hidden"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-4" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[min(18rem,100vw)] gap-0 p-0 pb-[env(safe-area-inset-bottom)]"
        >
          <SheetHeader className="h-14 justify-center border-b pt-[env(safe-area-inset-top)]">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Logo />
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <NavItems items={navigation} onNavigate={() => setOpen(false)} />
          </div>
          <Separator />
          <div className="flex items-center gap-2 p-3">
            {user ? (
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <Avatar size="sm">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt="" />
                  ) : null}
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <Badge
                    variant="secondary"
                    className="mt-0.5 h-4 px-1.5 text-[10px]"
                  >
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </div>
              </div>
            ) : null}
            <ThemeToggle />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
