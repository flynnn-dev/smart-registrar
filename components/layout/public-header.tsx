import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { PublicMobileNav } from "@/components/layout/public-mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { landingLinks } from "@/lib/navigation";

type PublicHeaderProps = {
  showActions?: boolean;
  showSectionLinks?: boolean;
};

export function PublicHeader({
  showActions = true,
  showSectionLinks = false,
}: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <Logo />
        {showSectionLinks ? (
          <nav
            aria-label="Landing"
            className="hidden items-center gap-5 text-sm text-muted-foreground md:flex"
          >
            {landingLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {showActions ? (
            <>
              <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="hidden md:inline-flex" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          ) : null}
          <PublicMobileNav
            showActions={showActions}
            showSectionLinks={showSectionLinks}
          />
        </div>
      </div>
    </header>
  );
}
