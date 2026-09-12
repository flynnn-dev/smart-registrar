import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import {
  APP_CONTACT_EMAIL,
  APP_CONTACT_LOCATION,
  APP_CONTACT_OFFICE,
  APP_NAME,
} from "@/lib/brand";

type PublicFooterProps = {
  officeHours?: string | null;
};

export function PublicFooter({ officeHours }: PublicFooterProps) {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-4 md:px-6">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            {APP_NAME} helps students request documents without waiting in an
            untracked line.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium">Navigation</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/#process" className="hover:text-foreground">
                Process
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-foreground">
                Services
              </Link>
            </li>
            <li>
              <Link href="/#why" className="hover:text-foreground">
                Why
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-foreground">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-foreground">
                Get Started
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>{APP_CONTACT_OFFICE}</li>
            <li>{APP_CONTACT_LOCATION}</li>
            <li>
              <a href={`mailto:${APP_CONTACT_EMAIL}`} className="hover:text-foreground">
                {APP_CONTACT_EMAIL}
              </a>
            </li>
            {officeHours ? <li>{officeHours}</li> : null}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-caption md:px-6">
          © {new Date().getFullYear()} {APP_NAME}. Student project demonstration.
        </p>
      </div>
    </footer>
  );
}
