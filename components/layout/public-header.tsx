"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@/components/layout/logo";
import { PublicMobileNav } from "@/components/layout/public-mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { landingLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type PublicHeaderProps = {
  showActions?: boolean;
  showSectionLinks?: boolean;
};

export function PublicHeader({
  showActions = true,
  showSectionLinks = false,
}: PublicHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const marketing = showSectionLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!showSectionLinks) {
      return;
    }

    const ids = landingLinks.map((link) => link.href.replace("/#", ""));
    const observers = ids.map((id) => {
      const element = document.getElementById(id);
      if (!element) {
        return null;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id);
          }
        },
        { rootMargin: "-28% 0px -62% 0px", threshold: 0 }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      for (const observer of observers) {
        observer?.disconnect();
      }
    };
  }, [showSectionLinks]);

  return (
    <header
      className={cn(
        "sticky top-0 z-20 pt-[env(safe-area-inset-top)] motion-safe:transition-[background-color,box-shadow,border-color] motion-safe:duration-200",
        marketing
          ? cn(
              "border-b border-white/8 bg-black text-white",
              scrolled && "shadow-[0_8px_24px_-16px_rgb(0_0_0/0.6)]"
            )
          : cn(
              "border-b backdrop-blur-sm",
              scrolled
                ? "border-border bg-background/94 shadow-xs"
                : "border-border/70 bg-background/80"
            )
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <Logo tone={marketing ? "inverse" : "default"} />
        {showSectionLinks ? (
          <nav
            aria-label="Landing"
            className="hidden items-center gap-1 text-sm md:flex"
          >
            {landingLinks.map((link) => {
              const id = link.href.replace("/#", "");
              const isActive = activeId === id;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-1.5 motion-safe:transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none",
                    isActive
                      ? "bg-white/10 font-medium text-white"
                      : "text-white/70 hover:bg-white/8 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle
            className={
              marketing
                ? "text-white hover:bg-white/10 hover:text-white"
                : undefined
            }
          />
          {showActions ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "hidden md:inline-flex",
                  marketing && "text-white hover:bg-white/10 hover:text-white"
                )}
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="landing-cta hidden px-4 md:inline-flex"
                asChild
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          ) : null}
          <PublicMobileNav
            showActions={showActions}
            showSectionLinks={showSectionLinks}
            tone={marketing ? "inverse" : "default"}
          />
        </div>
      </div>
    </header>
  );
}
