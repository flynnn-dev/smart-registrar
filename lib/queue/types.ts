import type { QueueStatus } from "@/lib/status";
import { schoolCalendarDate } from "@/lib/format/datetime";

export type QueueRecord = {
  id: string;
  date: string;
  number: string;
  status: QueueStatus;
  calledAt: string | null;
  completedAt: string | null;
  studentName: string;
  studentId: string | null;
  requestId: string | null;
  requestNumber: string | null;
  documentName: string | null;
};

export type QueueBoard = {
  date: string;
  servingNumber: string | null;
  nextNumbers: string[];
  waitingCount: number;
  servingCount: number;
  completedCount: number;
  skippedCount: number;
  cancelledCount: number;
  estimatedMinutesPerTicket: number;
  yourNumber: string | null;
  yourStatus: QueueStatus | null;
  peopleAhead: number | null;
  estimatedWaitMinutes: number | null;
};

export type QueueStats = {
  waiting: number;
  serving: number;
  completed: number;
  skipped: number;
  cancelled: number;
};

export function emptyQueueBoard(date: string): QueueBoard {
  return {
    date,
    servingNumber: null,
    nextNumbers: [],
    waitingCount: 0,
    servingCount: 0,
    completedCount: 0,
    skippedCount: 0,
    cancelledCount: 0,
    estimatedMinutesPerTicket: 5,
    yourNumber: null,
    yourStatus: null,
    peopleAhead: null,
    estimatedWaitMinutes: null,
  };
}

export function parseQueueDate(value?: string): string {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : schoolCalendarDate();
}

export function formatWaitMinutes(minutes: number | null): string {
  if (minutes === null) {
    return "—";
  }

  if (minutes === 0) {
    return "No wait";
  }

  if (minutes === 1) {
    return "About 1 minute";
  }

  return `About ${minutes} minutes`;
}

export function isOpenQueueStatus(status: QueueStatus): boolean {
  return status === "waiting" || status === "serving" || status === "skipped";
}
