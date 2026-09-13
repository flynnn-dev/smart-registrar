import { cn } from "@/lib/utils";

type QueuePreviewProps = {
  className?: string;
};

export function QueuePreview({ className }: QueuePreviewProps) {
  return (
    <aside
      aria-label="Digital queue preview"
      className={cn(
        "overflow-hidden rounded-xl bg-white text-neutral-950",
        className
      )}
    >
      <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-4">
        <p className="text-xs leading-5 text-neutral-500">Digital queue</p>
        <p className="mt-1 text-sm font-medium text-neutral-950">
          Tue, Sep 15 · Registrar window
        </p>
      </div>

      <div className="space-y-3 bg-white p-5">
        <div className="rounded-xl bg-neutral-50 px-5 py-6 text-center">
          <p className="inline-flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
            <span
              aria-hidden
              className="landing-live-dot size-1.5 rounded-full bg-emerald-500"
            />
            Now serving
          </p>
          <p className="mt-2 font-mono text-4xl font-semibold tracking-tight">
            A-024
          </p>
        </div>

        <div className="rounded-xl border border-[oklch(0.88_0.05_195)] bg-[oklch(0.96_0.035_195)] px-5 py-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[oklch(0.42_0.1_198)]">
            Your number
          </p>
          <p className="mt-2 font-mono text-5xl font-semibold tracking-tight text-[oklch(0.38_0.11_198)]">
            A-027
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
            <p className="text-xs leading-5 text-neutral-500">People ahead</p>
            <p className="mt-1 text-lg font-semibold text-neutral-950">3</p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
            <p className="text-xs leading-5 text-neutral-500">Estimated wait</p>
            <p className="mt-1 text-lg font-semibold text-neutral-950">25 min</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
