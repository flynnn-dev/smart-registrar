import Link from "next/link";

import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";

type LogoProps = {
  compact?: boolean;
  tone?: "default" | "inverse";
  className?: string;
  href?: string;
};

export function Logo({
  compact = false,
  tone = "default",
  className,
  href = "/",
}: LogoProps) {
  const inverse = tone === "inverse";

  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md shadow-xs",
          inverse
            ? "bg-white text-ink"
            : "bg-primary text-primary-foreground"
        )}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none">
          <path
            d="M8 4.75h6.15L17.25 8v10.25H8A1.25 1.25 0 0 1 6.75 17V6A1.25 1.25 0 0 1 8 4.75Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M14.1 4.75V7.85h3.15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9.35 12h5.3M9.35 14.75h3.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {compact ? (
        <span className="sr-only">{APP_NAME}</span>
      ) : (
        <span className="min-w-0 leading-tight">
          <span
            className={cn(
              "block truncate text-sm font-semibold tracking-tight",
              inverse ? "text-white" : "text-foreground"
            )}
          >
            {APP_NAME}
          </span>
          {inverse ? null : (
            <span className="block truncate text-[11px] text-muted-foreground">
              {APP_TAGLINE}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
