import { QueuePreview } from "@/components/landing/queue-preview";
import { Reveal } from "@/components/motion/reveal";

export function ProductPreviewSection() {
  return (
    <section id="preview" className="scroll-mt-20">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="text-caption font-medium uppercase tracking-[0.16em]">
            Queue
          </p>
          <h2 className="mt-3 text-page-title md:text-4xl">
            Walk in when your number is close.
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
            See who is at the window, how many people are ahead, and the number
            that belongs to you — so you are not guessing from the hallway.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="overflow-hidden rounded-[1.75rem] bg-muted/70 p-2 ring-1 ring-border">
            <QueuePreview className="border-0 shadow-none" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
