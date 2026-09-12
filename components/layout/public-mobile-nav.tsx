"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { landingLinks } from "@/lib/navigation";

type PublicMobileNavProps = {
  showActions?: boolean;
  showSectionLinks?: boolean;
};

export function PublicMobileNav({
  showActions = true,
  showSectionLinks = false,
}: PublicMobileNavProps) {
  const [open, setOpen] = useState(false);

  if (!showActions && !showSectionLinks) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-10 md:hidden"
        aria-label="Open menu"
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
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Logo />
          </SheetHeader>
          {showSectionLinks ? (
            <nav aria-label="Landing" className="flex flex-col gap-0.5 px-3 py-4">
              {landingLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2.5 py-2.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
          {showActions ? (
            <>
              {showSectionLinks ? <Separator /> : null}
              <div className="flex flex-col gap-2 p-4">
                <Button variant="outline" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
