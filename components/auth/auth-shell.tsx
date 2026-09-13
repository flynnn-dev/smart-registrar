import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { APP_CONTACT_OFFICE, APP_SCHOOL_NAME } from "@/lib/brand";

const AUTH_FACTS = ["Request online", "Book a slot", "Digital queue"] as const;

type AuthShellProps = {
  headline: string;
  description: string;
  children: React.ReactNode;
};

export function AuthShell({ headline, description, children }: AuthShellProps) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="relative overflow-hidden bg-ink px-6 py-8 text-white lg:flex lg:w-[min(28rem,42%)] lg:shrink-0 lg:flex-col lg:justify-center lg:px-12 lg:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(28rem_18rem_at_10%_0%,color-mix(in_oklch,var(--warm)_20%,transparent),transparent_58%),radial-gradient(22rem_16rem_at_100%_100%,color-mix(in_oklch,var(--brand)_28%,transparent),transparent_50%)]"
        />
        <Reveal instant className="relative">
          <p className="text-sm text-white/50">
            {APP_SCHOOL_NAME}
            <span className="mx-2 text-white/25" aria-hidden>
              ·
            </span>
            {APP_CONTACT_OFFICE}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
            {headline}
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/60 lg:text-base lg:leading-7">
            {description}
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70 lg:mt-8 lg:flex-col lg:gap-3">
            {AUTH_FACTS.map((fact) => (
              <li key={fact} className="inline-flex items-center gap-2">
                <Check className="size-3.5 text-white/80" aria-hidden />
                {fact}
              </li>
            ))}
          </ul>
        </Reveal>
      </aside>

      <div className="flex flex-1 items-center justify-center bg-background px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <Reveal instant delay={2} className="w-full max-w-md">
          {children}
        </Reveal>
      </div>
    </div>
  );
}
