import type { QueueStatus } from "@/lib/status";
import type { QueueBoard, QueueRecord } from "@/lib/queue/types";
import { emptyQueueBoard } from "@/lib/queue/types";

export type QueueQueryRow = {
  id: string;
  queue_date: string;
  queue_number: string;
  status: QueueStatus;
  called_at: string | null;
  completed_at: string | null;
  request_id: string;
  document_requests:
    | {
        request_number: string;
        profiles:
          | { full_name: string | null; student_id: string | null }
          | { full_name: string | null; student_id: string | null }[]
          | null;
        document_types: { name: string } | { name: string }[] | null;
      }
    | {
        request_number: string;
        profiles:
          | { full_name: string | null; student_id: string | null }
          | { full_name: string | null; student_id: string | null }[]
          | null;
        document_types: { name: string } | { name: string }[] | null;
      }[]
    | null;
};

export type QueueBoardRow = {
  cancelled_count: number;
  completed_count: number;
  estimated_minutes_per_ticket: number;
  estimated_wait_minutes: number | null;
  next_numbers: string[] | null;
  people_ahead: number | null;
  serving_count: number;
  serving_number: string | null;
  skipped_count: number;
  waiting_count: number;
  your_number: string | null;
  your_status: QueueStatus | null;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function toQueueRecord(
  row: QueueQueryRow,
  fallbackName = "Student"
): QueueRecord {
  const request = one(row.document_requests);
  const profile = one(request?.profiles);
  const documentType = one(request?.document_types);

  return {
    id: row.id,
    date: row.queue_date,
    number: row.queue_number,
    status: row.status,
    calledAt: row.called_at,
    completedAt: row.completed_at,
    studentName: profile?.full_name?.trim() || fallbackName,
    studentId: profile?.student_id ?? null,
    requestId: row.request_id,
    requestNumber: request?.request_number ?? null,
    documentName: documentType?.name ?? null,
  };
}

export function boardFromEntries(date: string, entries: QueueRecord[]): QueueBoard {
  const waiting = entries.filter((entry) => entry.status === "waiting");
  const serving = entries.filter((entry) => entry.status === "serving");

  return {
    date,
    servingNumber: serving[0]?.number ?? null,
    nextNumbers: waiting.slice(0, 3).map((entry) => entry.number),
    waitingCount: waiting.length,
    servingCount: serving.length,
    completedCount: entries.filter((entry) => entry.status === "completed").length,
    skippedCount: entries.filter((entry) => entry.status === "skipped").length,
    cancelledCount: entries.filter((entry) => entry.status === "cancelled").length,
    estimatedMinutesPerTicket: 5,
    yourNumber: null,
    yourStatus: null,
    peopleAhead: null,
    estimatedWaitMinutes: null,
  };
}

export function toQueueBoard(date: string, row?: QueueBoardRow | null): QueueBoard {
  if (!row) {
    return emptyQueueBoard(date);
  }

  return {
    date,
    servingNumber: row.serving_number,
    nextNumbers: row.next_numbers ?? [],
    waitingCount: row.waiting_count,
    servingCount: row.serving_count,
    completedCount: row.completed_count,
    skippedCount: row.skipped_count,
    cancelledCount: row.cancelled_count,
    estimatedMinutesPerTicket: row.estimated_minutes_per_ticket,
    yourNumber: row.your_number,
    yourStatus: row.your_status,
    peopleAhead: row.people_ahead,
    estimatedWaitMinutes: row.estimated_wait_minutes,
  };
}

export const QUEUE_SELECT =
  "id, queue_date, queue_number, status, called_at, completed_at, request_id, document_requests(request_number, profiles(full_name, student_id), document_types(name))";
