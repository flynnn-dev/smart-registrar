import Link from "next/link";

import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";

type LogoProps = {
  compact?: boolean;
  className?: string;
  href?: string;
};

export function Logo({ compact = false, className, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="inline-flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none">
          <path
            d="M7 4.75h7.2L18.25 8.8V19.25H7A1.25 1.25 0 0 1 5.75 18V6A1.25 1.25 0 0 1 7 4.75Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M14.2 4.75V8.6h3.85"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 12.25h7M8.5 15.5h4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {compact ? (
        <span className="sr-only">{APP_NAME}</span>
      ) : (
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold tracking-tight text-foreground">
            {APP_NAME}
          </span>
          <span className="block truncate text-[11px] text-muted-foreground">
            {APP_TAGLINE}
          </span>
        </span>
      )}
    </Link>
  );
}
