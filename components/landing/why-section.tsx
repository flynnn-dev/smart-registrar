import { Bell, Clock3, FolderKanban, FilePlus2 } from "lucide-react";

const REASONS = [
  {
    title: "Less waiting",
    description:
      "Request online and arrive only when you have an appointment or a ready document.",
    icon: Clock3,
  },
  {
    title: "Easier requests",
    description:
      "Submit the document type, purpose, and schedule in one place instead of paper forms.",
    icon: FilePlus2,
  },
  {
    title: "Organized processing",
    description:
      "Staff work from one queue and one request list, so each file stays in order.",
    icon: FolderKanban,
  },
  {
    title: "Real-time status updates",
    description:
      "See when a request is under review, processing, or ready for pickup.",
    icon: Bell,
  },
] as const;

export function WhySection() {
  return (
    <section id="why" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <p className="text-caption font-medium uppercase tracking-[0.16em]">
          Why Smart Registrar?
        </p>
        <h2 className="mt-2 text-page-title">A clearer path through the office</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {REASONS.map((reason) => {
            const Icon = reason.icon;

            return (
              <li key={reason.title} className="flex gap-4 rounded-xl border bg-card p-5">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div>
                  <h3 className="text-card-title">{reason.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {reason.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
