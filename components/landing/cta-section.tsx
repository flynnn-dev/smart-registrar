import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-ink text-white">
      <Reveal className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-20 text-center md:px-6 md:py-28">
        <h2 className="landing-display text-white md:text-5xl">
          Have the request in before you reach the window.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/60">
          Create a student account, submit the document, and keep the queue
          number with you.
        </p>
        <Button size="lg" className="landing-cta mt-8 h-11 px-6" asChild>
          <Link href="/register">
            Request a document
            <ArrowRight
              className="size-4 motion-safe:transition-transform motion-safe:duration-200 group-hover/button:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}
