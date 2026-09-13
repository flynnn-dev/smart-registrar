import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  {
    title: "Submit a request",
    description: "Choose the document and tell the office why you need it.",
  },
  {
    title: "Choose a slot",
    description: "Pick an open appointment during registrar office hours.",
  },
  {
    title: "Track the work",
    description: "Follow review and processing from your student account.",
  },
  {
    title: "Pick it up",
    description: "Get notified when it is ready, then collect it at the window.",
  },
] as const;

export function ProcessSection() {
  return (
    <section id="process" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <Reveal>
          <p className="text-center text-caption font-medium uppercase tracking-[0.16em]">
            How it works
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-center text-page-title md:text-4xl">
            Four steps from request to pickup
          </h2>
        </Reveal>
        <ol className="relative mt-14 space-y-8 md:grid md:grid-cols-4 md:gap-8 md:space-y-0">
          <span
            aria-hidden
            className="absolute top-5 bottom-5 left-5 w-px bg-border md:hidden"
          />
          <span
            aria-hidden
            className="absolute top-5 right-[12%] left-[12%] hidden h-px bg-border md:block"
          />
          {STEPS.map((step, index) => {
            const delay = Math.min(index + 1, 4) as 1 | 2 | 3 | 4;

            return (
              <Reveal
                key={step.title}
                as="li"
                delay={delay}
                className="relative pl-14 md:pl-0"
              >
                <div className="md:flex md:flex-col md:items-center md:text-center">
                  <span className="absolute top-0 left-0 z-10 inline-flex size-10 items-center justify-center rounded-full border bg-background text-xs font-medium shadow-xs md:static">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight md:mt-5">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
