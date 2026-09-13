import { cn } from "@/lib/utils";

export const REQUEST_STEPS = [
  { id: 1, label: "Document" },
  { id: 2, label: "Details" },
  { id: 3, label: "Schedule" },
  { id: 4, label: "Review" },
] as const;

type RequestStepperProps = {
  currentStep: number;
};

export function RequestStepper({ currentStep }: RequestStepperProps) {
  const current = REQUEST_STEPS.find((step) => step.id === currentStep);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground md:hidden">
        Step {currentStep} of {REQUEST_STEPS.length}
        {current ? ` · ${current.label}` : null}
      </p>
      <ol className="flex items-start">
        {REQUEST_STEPS.map((step, index) => {
          const complete = currentStep > step.id;
          const active = currentStep === step.id;
          const last = index === REQUEST_STEPS.length - 1;

          return (
            <li key={step.id} className="flex flex-1 flex-col items-stretch">
              <div className="flex items-center">
                <span
                  aria-hidden
                  className={cn(
                    "h-px flex-1",
                    index === 0
                      ? "bg-transparent"
                      : complete || active
                        ? "bg-status-completed"
                        : "bg-border"
                  )}
                />
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                    complete &&
                      "border-status-completed bg-status-completed text-white",
                    active &&
                      "border-primary bg-primary text-primary-foreground ring-4 ring-primary/15",
                    !complete &&
                      !active &&
                      "border-border bg-background text-muted-foreground"
                  )}
                >
                  {step.id}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "h-px flex-1",
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
                  "mt-2 hidden text-center text-xs md:block",
                  active ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
