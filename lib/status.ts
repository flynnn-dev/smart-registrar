export const REQUEST_STATUSES = [
  "submitted",
  "under_review",
  "processing",
  "ready_for_pickup",
  "completed",
  "rejected",
] as const;

export const APPOINTMENT_STATUSES = [
  "scheduled",
  "checked_in",
  "completed",
  "cancelled",
  "missed",
] as const;

export const QUEUE_STATUSES = [
  "waiting",
  "serving",
  "completed",
  "skipped",
  "cancelled",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];
export type QueueStatus = (typeof QUEUE_STATUSES)[number];

export const REQUEST_PIPELINE = [
  "submitted",
  "under_review",
  "processing",
  "ready_for_pickup",
  "completed",
] as const;

export type RequestPipelineStatus = (typeof REQUEST_PIPELINE)[number];

export const ACTIVE_REQUEST_STATUSES = [
  "submitted",
  "under_review",
  "processing",
  "ready_for_pickup",
] as const;

export function isActiveRequestStatus(
  status: RequestStatus
): status is (typeof ACTIVE_REQUEST_STATUSES)[number] {
  return ACTIVE_REQUEST_STATUSES.some((value) => value === status);
}

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  processing: "Processing",
  ready_for_pickup: "Ready for Pickup",
  completed: "Completed",
  rejected: "Rejected",
};

export const REQUEST_TRANSITIONS: Record<
  RequestStatus,
  readonly RequestStatus[]
> = {
  submitted: ["under_review", "rejected"],
  under_review: ["processing", "rejected", "submitted"],
  processing: ["ready_for_pickup", "rejected", "under_review"],
  ready_for_pickup: ["completed", "processing"],
  completed: [],
  rejected: ["submitted", "under_review"],
};

export function canTransitionRequest(
  from: RequestStatus,
  to: RequestStatus
): boolean {
  return from === to || REQUEST_TRANSITIONS[from].includes(to);
}

export function requestStatusActionLabel(
  from: RequestStatus,
  to: RequestStatus
): string {
  if (to === "rejected") {
    return "Needs correction";
  }

  if (to === "under_review" && from === "submitted") {
    return "Start review";
  }

  if (to === "under_review" && from === "rejected") {
    return "Send to review";
  }

  if (to === "under_review" && from === "processing") {
    return "Return to review";
  }

  if (to === "processing" && from === "under_review") {
    return "Start processing";
  }

  if (to === "processing" && from === "ready_for_pickup") {
    return "Return to processing";
  }

  if (to === "ready_for_pickup") {
    return "Ready for pickup";
  }

  if (to === "completed") {
    return "Mark completed";
  }

  if (to === "submitted" && from === "under_review") {
    return "Return to submitted";
  }

  if (to === "submitted" && from === "rejected") {
    return "Reopen request";
  }

  return REQUEST_STATUS_LABELS[to];
}

export const APPOINTMENT_TRANSITIONS: Record<
  AppointmentStatus,
  readonly AppointmentStatus[]
> = {
  scheduled: ["checked_in", "cancelled", "missed"],
  checked_in: ["completed", "cancelled", "missed"],
  completed: [],
  cancelled: [],
  missed: [],
};

export function canTransitionAppointment(
  from: AppointmentStatus,
  to: AppointmentStatus
): boolean {
  return from === to || APPOINTMENT_TRANSITIONS[from].includes(to);
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Scheduled",
  checked_in: "Checked In",
  completed: "Completed",
  cancelled: "Cancelled",
  missed: "Missed",
};

export const QUEUE_TRANSITIONS: Record<QueueStatus, readonly QueueStatus[]> = {
  waiting: ["serving", "skipped", "cancelled"],
  serving: ["completed", "skipped", "cancelled"],
  skipped: ["serving", "cancelled"],
  completed: [],
  cancelled: [],
};

export function canTransitionQueue(
  from: QueueStatus,
  to: QueueStatus
): boolean {
  return from === to || QUEUE_TRANSITIONS[from].includes(to);
}

export const QUEUE_STATUS_LABELS: Record<QueueStatus, string> = {
  waiting: "Waiting",
  serving: "Serving",
  completed: "Completed",
  skipped: "Skipped",
  cancelled: "Cancelled",
};
