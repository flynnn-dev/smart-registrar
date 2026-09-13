import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { APP_CONTACT_OFFICE, APP_SCHOOL_NAME } from "@/lib/brand";

const HERO_FACTS = ["Request online", "Book a slot", "Digital queue"] as const;

export function LandingHero() {
  return (
    <section className="relative overflow-x-clip bg-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70rem_28rem_at_50%_-12%,color-mix(in_oklch,var(--warm)_24%,transparent),transparent_58%),radial-gradient(36rem_20rem_at_92%_18%,color-mix(in_oklch,var(--brand)_36%,transparent),transparent_52%)]"
      />
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-16 pb-10 text-center md:px-6 md:pt-24 md:pb-14">
        <Reveal instant className="w-full">
          <p className="text-sm text-white/50">
            {APP_SCHOOL_NAME}
            <span className="mx-2 text-white/25" aria-hidden>
              ·
            </span>
            {APP_CONTACT_OFFICE}
          </p>
        </Reveal>
        <Reveal instant delay={1} className="w-full">
          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/55">
            {HERO_FACTS.map((fact) => (
              <span key={fact} className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-white/80" aria-hidden />
                {fact}
              </span>
            ))}
          </p>
        </Reveal>
        <Reveal instant delay={2} className="w-full">
          <h1 className="landing-display mt-6 text-white">Skip the long line.</h1>
        </Reveal>
        <Reveal instant delay={3} className="w-full">
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
            Request your document, choose a pickup slot, and follow a queue number
            until the office is ready.
          </p>
        </Reveal>
        <Reveal instant delay={4} className="w-full">
          <div className="mx-auto mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-fit sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="landing-cta h-11 w-full px-6 sm:w-auto"
              asChild
            >
              <Link href="/register">
                Request a document
                <ArrowRight
                  className="size-4 motion-safe:transition-transform motion-safe:duration-200 group-hover/button:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-11 w-full rounded-full border border-white/25 !bg-transparent px-6 text-white hover:!bg-white/10 hover:!text-white dark:border-white/25 dark:!bg-transparent dark:text-white dark:hover:!bg-white/10 dark:hover:!text-white sm:w-auto"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </Reveal>
      </div>

      <Reveal instant delay={4} className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-0 md:px-6">
        <div className="translate-y-10 overflow-hidden rounded-[1.75rem] bg-[oklch(0.2_0.03_215)] p-2 shadow-[0_24px_80px_-28px_oklch(0.12_0.05_210/0.75)] ring-1 ring-white/10 md:translate-y-14">
          <DashboardPreview className="border-0 shadow-none" />
        </div>
      </Reveal>
    </section>
  );
}
