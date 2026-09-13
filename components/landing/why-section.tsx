import { Bell, Clock3, FolderKanban, Ticket } from "lucide-react";

const REASONS = [
  {
    title: "Less Waiting",
    description: "Submit requests online before you visit the registrar.",
    icon: Clock3,
  },
  {
    title: "Organized Processing",
    description: "Staff manage requests and appointments from one place.",
    icon: FolderKanban,
  },
  {
    title: "Real-Time Updates",
    description: "Track your request status as the office works on it.",
    icon: Bell,
  },
  {
    title: "Digital Queue",
    description: "Receive a digital queue and request number you can follow.",
    icon: Ticket,
  },
] as const;

export function WhySection() {
  return (
    <section id="why" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 pt-28 pb-20 md:px-6 md:pt-36 md:pb-28">
        <h2 className="mx-auto max-w-2xl text-center text-page-title md:text-4xl">
          A clearer path through the office
        </h2>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {REASONS.map((reason) => {
            const Icon = reason.icon;

            return (
              <li key={reason.title} className="landing-feature-card">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {reason.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
