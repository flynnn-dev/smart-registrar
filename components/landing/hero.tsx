import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Button } from "@/components/ui/button";
import { APP_DESCRIPTION } from "@/lib/brand";

const HERO_FACTS = ["Request online", "Digital queue"] as const;

export function LandingHero() {
  return (
    <section className="relative overflow-x-clip bg-black text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-16 pb-10 text-center md:px-6 md:pt-24 md:pb-14">
        <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/55">
          {HERO_FACTS.map((fact) => (
            <span key={fact} className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 text-white/80" aria-hidden />
              {fact}
            </span>
          ))}
        </p>
        <h1 className="landing-display mt-6 text-white">
          Smarter Registrar Services
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
          {APP_DESCRIPTION}
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            size="lg"
            className="landing-cta h-11 w-full px-6 sm:w-auto"
            asChild
          >
            <Link href="/register">
              Get Started
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 w-full rounded-full border-white/20 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white sm:w-auto"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl translate-y-10 px-4 pb-0 md:translate-y-14 md:px-6">
        <div className="overflow-hidden rounded-[1.75rem] bg-neutral-900 p-2 shadow-[0_24px_80px_-28px_rgb(0_0_0/0.7)] ring-1 ring-white/10">
          <DashboardPreview className="border-0 shadow-none" />
        </div>
      </div>
    </section>
  );
}
