import { Check } from "lucide-react";

import {
  REQUEST_PIPELINE,
  REQUEST_STATUS_LABELS,
  type RequestStatus,
} from "@/lib/status";
import { cn } from "@/lib/utils";

type RequestTimelineProps = {
  status: RequestStatus;
};

export function RequestTimeline({ status }: RequestTimelineProps) {
  const currentIndex =
    status === "rejected"
      ? -1
      : REQUEST_PIPELINE.findIndex((step) => step === status);

  return (
    <ol className="space-y-3 md:flex md:items-start md:space-y-0">
      {REQUEST_PIPELINE.map((step, index) => {
        const complete = currentIndex > index;
        const current = currentIndex === index;
        const last = index === REQUEST_PIPELINE.length - 1;

        return (
          <li
            key={step}
            aria-current={current ? "step" : undefined}
            className="flex flex-1 items-start gap-3 md:flex-col md:items-stretch"
          >
            <div className="flex items-center md:w-full">
              <span
                aria-hidden
                className={cn(
                  "hidden h-px flex-1 md:block",
                  index === 0
                    ? "bg-transparent"
                    : complete || current
                      ? "bg-status-completed"
                      : "bg-border"
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium",
                  complete &&
                    "border-status-completed bg-status-completed text-white",
                  current &&
                    "border-primary bg-primary text-primary-foreground ring-4 ring-primary/15",
                  !complete &&
                    !current &&
                    "border-border bg-background text-muted-foreground"
                )}
              >
                {complete ? <Check className="size-3" /> : index + 1}
              </span>
              <span
                aria-hidden
                className={cn(
                  "hidden h-px flex-1 md:block",
                  last
                    ? "bg-transparent"
                    : complete
                      ? "bg-status-completed"
                      : "bg-border"
                )}
              />
            </div>
            <p
              className={cn(
                "pt-0.5 text-xs leading-5 md:text-center",
                current
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {REQUEST_STATUS_LABELS[step]}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
