import {
  CalendarDays,
  ClipboardList,
  FilePlus2,
  PackageCheck,
} from "lucide-react";

const STEPS = [
  {
    title: "Submit Request",
    description: "Choose the document you need and tell the office why you need it.",
    icon: FilePlus2,
  },
  {
    title: "Choose Schedule",
    description: "Pick an open appointment slot that fits the registrar office hours.",
    icon: CalendarDays,
  },
  {
    title: "Track Progress",
    description: "Follow the request from review to processing with a clear status.",
    icon: ClipboardList,
  },
  {
    title: "Pick Up Your Document",
    description: "Get notified when it is ready, then collect it at the registrar office.",
    icon: PackageCheck,
  },
] as const;

export function ProcessSection() {
  return (
    <section id="process" className="scroll-mt-20 border-b">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <p className="text-caption font-medium uppercase tracking-[0.16em]">
          Simple Process
        </p>
        <h2 className="mt-2 text-page-title">Four steps from request to pickup</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.title}
                className="rounded-xl border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="text-caption">{index + 1} / 4</span>
                </div>
                <h3 className="mt-4 text-card-title">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
