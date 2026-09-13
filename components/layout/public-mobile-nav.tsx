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
import { cn } from "@/lib/utils";

type PublicMobileNavProps = {
  showActions?: boolean;
  showSectionLinks?: boolean;
  tone?: "default" | "inverse";
};

export function PublicMobileNav({
  showActions = true,
  showSectionLinks = false,
  tone = "default",
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
        className={cn(
          showSectionLinks ? "size-10 lg:hidden" : "size-10 md:hidden",
          tone === "inverse" && "text-white hover:bg-white/10 hover:text-white"
        )}
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-4" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[min(20rem,100vw)] gap-0 p-0 pb-[env(safe-area-inset-bottom)]"
        >
          <SheetHeader className="h-14 justify-center border-b px-4 pt-[env(safe-area-inset-top)]">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Logo />
          </SheetHeader>
          {showSectionLinks ? (
            <nav aria-label="Landing" className="flex flex-col gap-1 px-3 py-4">
              {landingLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-3 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
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
                <Button variant="outline" className="min-h-11" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button className="landing-cta min-h-11" asChild>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    {showSectionLinks ? "Request a document" : "Create account"}
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
