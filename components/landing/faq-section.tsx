import { Reveal } from "@/components/motion/reveal";

const FAQS = [
  {
    question: "Do I still go to the registrar?",
    answer:
      "Yes. Pickup is at the office. You submit the request and follow your number online so you are not waiting in an untracked line.",
  },
  {
    question: "How long does a request take?",
    answer:
      "Each document lists an estimate. Staff confirm the release date after they review your request.",
  },
  {
    question: "I already have an account.",
    answer:
      "Sign in and start a request. New students create an account first, then submit from the student dashboard.",
  },
] as const;

export function FaqSection() {
  return (
    <section className="scroll-mt-20">
      <div className="mx-auto w-full max-w-3xl px-4 py-20 md:px-6 md:py-28">
        <Reveal>
          <p className="text-center text-caption font-medium uppercase tracking-[0.16em]">
            Questions
          </p>
          <h2 className="mt-3 text-center text-page-title md:text-4xl">
            Before you walk in
          </h2>
        </Reveal>
        <Reveal delay={1} className="mt-10 divide-y border-y">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group py-4">
              <summary className="cursor-pointer list-none rounded-sm text-sm font-medium tracking-tight marker:content-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span
                    aria-hidden
                    className="text-lg leading-none text-muted-foreground motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="landing-faq-answer mt-2 pr-8 text-sm leading-6 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
