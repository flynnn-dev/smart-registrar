import { Bell, Clock3, FolderKanban, Ticket } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

const REASONS = [
  {
    title: "Less waiting",
    description: "Submit the request before you walk into the office.",
    icon: Clock3,
  },
  {
    title: "One staff queue",
    description: "The registrar works requests and appointments in one place.",
    icon: FolderKanban,
  },
  {
    title: "Status you can see",
    description: "Follow the document from review to ready for pickup.",
    icon: Bell,
  },
  {
    title: "A number that stays",
    description: "Keep a digital queue number instead of standing in an untracked line.",
    icon: Ticket,
  },
] as const;

export function WhySection() {
  return (
    <section id="why" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 pt-28 pb-20 md:px-6 md:pt-36 md:pb-28">
        <Reveal>
          <p className="text-center text-caption font-medium uppercase tracking-[0.16em]">
            Benefits
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-center text-page-title md:text-4xl">
            Leave the paper line behind
          </h2>
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            const delay = Math.min(index + 1, 4) as 1 | 2 | 3 | 4;

            return (
              <Reveal
                key={reason.title}
                as="li"
                delay={delay}
                className="landing-feature-card"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {reason.description}
                </p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
