import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-black text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-20 text-center md:px-6 md:py-28">
        <h2 className="landing-display text-white md:text-5xl">
          Skip the long line. Start your request online.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/60">
          Submit your registrar request, choose your schedule, and track your
          progress from one place.
        </p>
        <Button
          size="lg"
          className="landing-cta mt-8 h-11 px-6"
          asChild
        >
          <Link href="/register">
            Get Started
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
