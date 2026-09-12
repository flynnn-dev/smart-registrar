import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUSES,
  QUEUE_STATUS_LABELS,
  QUEUE_STATUSES,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUSES,
  type AppointmentStatus,
  type QueueStatus,
  type RequestStatus,
} from "@/lib/status";

export const TRANSACTION_ACTIONS = [
  "request_created",
  "status_changed",
  "appointment_created",
  "appointment_status_changed",
  "queue_called",
  "queue_status_changed",
] as const;

export type TransactionAction = (typeof TRANSACTION_ACTIONS)[number];

export const TRANSACTION_ACTION_LABELS: Record<TransactionAction, string> = {
  request_created: "Request created",
  status_changed: "Status changed",
  appointment_created: "Appointment scheduled",
  appointment_status_changed: "Appointment updated",
  queue_called: "Queue called",
  queue_status_changed: "Queue updated",
};

export type StaffTransaction = {
  id: string;
  createdAt: string;
  action: string;
  actionLabel: string;
  remarks: string | null;
  requestId: string | null;
  requestNumber: string | null;
  documentName: string | null;
  studentUserId: string | null;
  studentName: string | null;
  studentCampusId: string | null;
  performerName: string | null;
};

function isRequestStatus(value: string): value is RequestStatus {
  return REQUEST_STATUSES.includes(value as RequestStatus);
}

function isAppointmentStatus(value: string): value is AppointmentStatus {
  return APPOINTMENT_STATUSES.includes(value as AppointmentStatus);
}

function isQueueStatus(value: string): value is QueueStatus {
  return QUEUE_STATUSES.includes(value as QueueStatus);
}

function statusPair(remarks: string | null) {
  const match = remarks?.match(/from ([a-z_]+) to ([a-z_]+)/i);
  return match ? { from: match[1], to: match[2] } : null;
}

export function isTransactionAction(value: string): value is TransactionAction {
  return TRANSACTION_ACTIONS.includes(value as TransactionAction);
}

export function describeTransactionAction(
  action: string,
  remarks: string | null
): string {
  if (action === "request_created") {
    return TRANSACTION_ACTION_LABELS.request_created;
  }

  if (action === "status_changed") {
    const pair = statusPair(remarks);

    if (pair && isRequestStatus(pair.from) && isRequestStatus(pair.to)) {
      if (pair.to === "ready_for_pickup") {
        return "Document marked Ready for Pickup";
      }

      if (pair.to === "completed") {
        return "Request completed";
      }

      if (pair.to === "rejected") {
        return "Request needs correction";
      }

      return `Status changed from ${REQUEST_STATUS_LABELS[pair.from]} to ${REQUEST_STATUS_LABELS[pair.to]}`;
    }

    return TRANSACTION_ACTION_LABELS.status_changed;
  }

  if (action === "appointment_created") {
    return TRANSACTION_ACTION_LABELS.appointment_created;
  }

  if (action === "appointment_status_changed") {
    const pair = statusPair(remarks);

    if (
      pair &&
      isAppointmentStatus(pair.from) &&
      isAppointmentStatus(pair.to)
    ) {
      return `Appointment status changed from ${APPOINTMENT_STATUS_LABELS[pair.from]} to ${APPOINTMENT_STATUS_LABELS[pair.to]}`;
    }

    return TRANSACTION_ACTION_LABELS.appointment_status_changed;
  }

  if (action === "queue_called") {
    return TRANSACTION_ACTION_LABELS.queue_called;
  }

  if (action === "queue_status_changed") {
    const pair = statusPair(remarks);

    if (pair && isQueueStatus(pair.from) && isQueueStatus(pair.to)) {
      return `Queue status changed from ${QUEUE_STATUS_LABELS[pair.from]} to ${QUEUE_STATUS_LABELS[pair.to]}`;
    }

    return TRANSACTION_ACTION_LABELS.queue_status_changed;
  }

  return isTransactionAction(action)
    ? TRANSACTION_ACTION_LABELS[action]
    : action.replaceAll("_", " ");
}
