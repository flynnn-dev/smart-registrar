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
  const helpHref = `mailto:${APP_CONTACT_EMAIL}?subject=Smart%20Registrar%20help`;
  const contactHref = `mailto:${APP_CONTACT_EMAIL}`;

  return (
    <footer className="bg-black text-white/70">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div>
          <Logo tone="inverse" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
            {APP_NAME} helps students request documents, book appointments, and
            follow a digital queue without an untracked line.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-white">Pages</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link href="/#process" className="hover:text-white">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Sign In
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-white">Support</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={contactHref} className="hover:text-white">
                Contact
              </a>
            </li>
            <li>
              <a href={helpHref} className="hover:text-white">
                Help
              </a>
            </li>
            <li>{APP_CONTACT_OFFICE}</li>
            <li>{APP_CONTACT_LOCATION}</li>
            {officeHours ? <li>{officeHours}</li> : null}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-white">Legal</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-white/45 md:px-6">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
