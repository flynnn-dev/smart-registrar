import { Bell, CalendarDays, Check, Clock, FileText, Ticket } from "lucide-react";

import { cn } from "@/lib/utils";

type DashboardPreviewProps = {
  variant?: "compact" | "full";
  className?: string;
};

export function DashboardPreview({
  variant = "compact",
  className,
}: DashboardPreviewProps) {
  return (
    <aside
      aria-label="Smart Registrar dashboard preview"
      className={cn(
        "overflow-hidden rounded-xl bg-white text-neutral-950",
        className
      )}
    >
      <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-4">
        <p className="text-xs leading-5 text-neutral-500">Student dashboard</p>
        <p className="mt-1 text-sm font-medium text-neutral-950">
          Good morning, Maria
        </p>
        <p className="text-xs leading-5 text-neutral-500">
          Manage your registrar requests and appointments.
        </p>
      </div>

      <div className="space-y-4 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs leading-5 text-neutral-500">Active request</p>
            <p className="mt-1 font-mono text-sm font-medium text-neutral-950">
              REG-2026-000184
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
            <Clock className="size-3.5" aria-hidden />
            Processing
          </span>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3">
          <span className="inline-flex size-8 items-center justify-center rounded-md bg-[oklch(0.95_0.04_195)] text-[oklch(0.4_0.1_198)]">
            <FileText className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-950">
              Transcript of Records
            </p>
            <p className="text-xs leading-5 text-neutral-500">
              Last updated · 2 hours ago
            </p>
          </div>
        </div>

        <div className={cn("grid gap-2", variant === "full" && "sm:grid-cols-2")}>
          <PreviewMeta
            icon={CalendarDays}
            label="Appointment"
            value="Tue, Sep 15 · 9:30 AM"
          />
          {variant === "full" ? (
            <PreviewMeta icon={Ticket} label="Queue number" value="A-027" />
          ) : null}
        </div>

        <div>
          <p className="mb-3 text-xs leading-5 text-neutral-500">Progress</p>
          <PreviewProgress current={3} />
        </div>

        {variant === "full" ? (
          <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-[oklch(0.95_0.04_195)] text-[oklch(0.4_0.1_198)]">
              <Bell className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-950">
                Request update
              </p>
              <p className="text-xs leading-5 text-neutral-500">
                Transcript of Records is now processing.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function PreviewMeta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-neutral-500">
        <Icon className="size-3.5" aria-hidden />
        <p className="text-xs leading-5">{label}</p>
      </div>
      <p className="mt-1 text-sm font-medium text-neutral-950">{value}</p>
    </div>
  );
}

function PreviewProgress({ current }: { current: number }) {
  const total = 5;

  return (
    <ol className="flex items-center" aria-hidden>
      {Array.from({ length: total }, (_, index) => {
        const step = index + 1;
        const complete = step < current;
        const active = step === current;
        const last = step === total;

        return (
          <li key={step} className="flex flex-1 items-center">
            {index > 0 ? (
              <span
                className={cn(
                  "h-px flex-1",
                  complete || active ? "bg-emerald-500" : "bg-neutral-200"
                )}
              />
            ) : null}
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium",
                complete && "bg-emerald-500 text-white",
                active && "bg-[oklch(0.48_0.12_198)] text-white",
                !complete &&
                  !active &&
                  "border border-neutral-200 bg-white text-neutral-400"
              )}
            >
              {complete ? <Check className="size-3" /> : step}
            </span>
            {last ? null : (
              <span
                className={cn(
                  "h-px flex-1",
                  complete ? "bg-emerald-500" : "bg-neutral-200"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
