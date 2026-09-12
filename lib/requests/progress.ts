import {
  REQUEST_PIPELINE,
  REQUEST_STATUS_LABELS,
  type RequestStatus,
} from "@/lib/status";

export type RequestHistoryEvent = {
  id: string;
  oldStatus: RequestStatus | null;
  newStatus: RequestStatus;
  remarks: string | null;
  createdAt: string;
};

export type ProgressStepState = "complete" | "current" | "upcoming" | "rejected";

export type ProgressStep = {
  status: RequestStatus;
  label: string;
  state: ProgressStepState;
  at: string | null;
  remarks: string | null;
};

function latestEvent(
  history: RequestHistoryEvent[],
  status: RequestStatus
): RequestHistoryEvent | null {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    const event = history[index];
    if (event.newStatus === status) {
      return event;
    }
  }

  return null;
}

function pipelineIndex(status: RequestStatus): number {
  return REQUEST_PIPELINE.findIndex((step) => step === status);
}

export function buildRequestProgress(
  status: RequestStatus,
  history: RequestHistoryEvent[],
  submittedAt: string
): ProgressStep[] {
  const rejectedEvent = latestEvent(history, "rejected");

  if (status === "rejected") {
    const reached = [...REQUEST_PIPELINE]
      .reverse()
      .find((step) => history.some((event) => event.newStatus === step));
    const reachedIndex = reached ? pipelineIndex(reached) : 0;
    const visible = REQUEST_PIPELINE.slice(0, Math.max(reachedIndex, 0) + 1);

    return [
      ...visible.map((step, index) => {
        const event = latestEvent(history, step);
        return {
          status: step,
          label: REQUEST_STATUS_LABELS[step],
          state: "complete" as const,
          at:
            event?.createdAt ??
            (index === 0 || step === "submitted" ? submittedAt : null),
          remarks: event?.remarks ?? null,
        };
      }),
      {
        status: "rejected",
        label: REQUEST_STATUS_LABELS.rejected,
        state: "rejected",
        at: rejectedEvent?.createdAt ?? null,
        remarks: rejectedEvent?.remarks ?? null,
      },
    ];
  }

  const currentIndex = pipelineIndex(status);

  return REQUEST_PIPELINE.map((step, index) => {
    const event = latestEvent(history, step);
    const isSubmitted = step === "submitted";
    let state: ProgressStepState = "upcoming";

    if (status === "completed" && step === "completed") {
      state = "complete";
    } else if (index < currentIndex) {
      state = "complete";
    } else if (index === currentIndex) {
      state = "current";
    }

    return {
      status: step,
      label: REQUEST_STATUS_LABELS[step],
      state,
      at:
        event?.createdAt ??
        (isSubmitted && (state === "complete" || state === "current")
          ? submittedAt
          : null),
      remarks: event?.remarks ?? null,
    };
  });
}

