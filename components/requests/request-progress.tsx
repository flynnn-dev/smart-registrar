import { Check, Circle, X } from "lucide-react";

import { formatDateTime } from "@/lib/format/datetime";
import type { ProgressStep } from "@/lib/requests/progress";
import { cn } from "@/lib/utils";

type RequestProgressProps = {
  steps: ProgressStep[];
};

export function RequestProgress({ steps }: RequestProgressProps) {
  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        const Icon =
          step.state === "rejected"
            ? X
            : step.state === "complete"
              ? Check
              : Circle;

        return (
          <li key={`${step.status}-${index}`} className="flex gap-3">
            <div className="flex w-6 flex-col items-center">
              <span
                aria-hidden
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border",
                  step.state === "complete" &&
                    "border-status-completed bg-status-completed text-white",
                  step.state === "current" &&
                    "border-primary bg-primary text-primary-foreground",
                  step.state === "rejected" &&
                    "border-status-rejected bg-status-rejected text-white",
                  step.state === "upcoming" &&
                    "border-border bg-background text-muted-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "size-3",
                    step.state === "current" && "fill-current"
                  )}
                />
              </span>
              {last ? null : (
                <span
                  aria-hidden
                  className={cn(
                    "min-h-8 w-px flex-1",
                    step.state === "complete"
                      ? "bg-status-completed"
                      : "bg-border"
                  )}
                />
              )}
            </div>
            <div className={cn("min-w-0 pb-6", last && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-medium",
                  step.state === "upcoming"
                    ? "text-muted-foreground"
                    : "text-foreground"
                )}
              >
                {step.label}
              </p>
              {step.at ? (
                <p className="mt-0.5 text-caption">{formatDateTime(step.at)}</p>
              ) : step.state === "upcoming" ? (
                <p className="mt-0.5 text-caption">Waiting</p>
              ) : null}
              {step.remarks ? (
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {step.remarks}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
