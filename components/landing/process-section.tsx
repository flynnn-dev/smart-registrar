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
    title: "Pick Up Document",
    description: "Get notified when it is ready, then collect it at the registrar office.",
    icon: PackageCheck,
  },
] as const;

export function ProcessSection() {
  return (
    <section id="process" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <p className="text-center text-caption font-medium uppercase tracking-[0.16em]">
          How it works
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-page-title md:text-4xl">
          Four steps from request to pickup
        </h2>
        <ol className="relative mt-14 space-y-8 md:grid md:grid-cols-4 md:gap-6 md:space-y-0">
          <span
            aria-hidden
            className="absolute top-5 bottom-5 left-5 w-px bg-border md:hidden"
          />
          <span
            aria-hidden
            className="absolute top-5 right-[12%] left-[12%] hidden h-px bg-border md:block"
          />
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <li key={step.title} className="relative pl-14 md:pl-0">
                <div className="flex items-start gap-3 md:flex-col md:items-center md:text-center">
                  <span className="absolute top-0 left-0 z-10 inline-flex size-10 items-center justify-center rounded-full border bg-background text-xs font-medium text-foreground shadow-xs md:static">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-muted text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
