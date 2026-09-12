import { describe, expect, it } from "vitest";

import { boardFromEntries, toQueueBoard } from "@/lib/queue/query";
import {
  formatWaitMinutes,
  isOpenQueueStatus,
  parseQueueDate,
  type QueueRecord,
} from "@/lib/queue/types";

function ticket(
  number: string,
  status: QueueRecord["status"],
  date = "2026-09-14"
): QueueRecord {
  return {
    id: number,
    date,
    number,
    status,
    calledAt: null,
    completedAt: null,
    studentName: "Student",
    studentId: "2026-00123",
    requestId: "req",
    requestNumber: "REG-2026-000001",
    documentName: "Transcript of Records",
  };
}

describe("parseQueueDate", () => {
  it("keeps a valid calendar date and rejects junk", () => {
    expect(parseQueueDate("2026-09-14")).toBe("2026-09-14");
    expect(parseQueueDate("14/09/2026")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(parseQueueDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("queue board helpers", () => {
  it("builds a staff board from the day's tickets", () => {
    const board = boardFromEntries("2026-09-14", [
      ticket("A-001", "completed"),
      ticket("A-002", "serving"),
      ticket("A-003", "waiting"),
      ticket("A-004", "waiting"),
      ticket("A-005", "waiting"),
      ticket("A-006", "waiting"),
      ticket("A-007", "skipped"),
    ]);

    expect(board.servingNumber).toBe("A-002");
    expect(board.nextNumbers).toEqual(["A-003", "A-004", "A-005"]);
    expect(board.waitingCount).toBe(4);
    expect(board.servingCount).toBe(1);
    expect(board.completedCount).toBe(1);
    expect(board.skippedCount).toBe(1);
  });

  it("maps the student board RPC without exposing other names", () => {
    const board = toQueueBoard("2026-09-14", {
      serving_number: "A-002",
      next_numbers: ["A-003"],
      waiting_count: 1,
      serving_count: 1,
      completed_count: 1,
      skipped_count: 0,
      cancelled_count: 0,
      estimated_minutes_per_ticket: 5,
      your_number: "A-003",
      your_status: "waiting",
      people_ahead: 0,
      estimated_wait_minutes: 0,
    });

    expect(board.servingNumber).toBe("A-002");
    expect(board.yourNumber).toBe("A-003");
    expect(board.peopleAhead).toBe(0);
  });

  it("formats wait copy and open statuses", () => {
    expect(formatWaitMinutes(null)).toBe("—");
    expect(formatWaitMinutes(0)).toBe("No wait");
    expect(formatWaitMinutes(1)).toBe("About 1 minute");
    expect(formatWaitMinutes(15)).toBe("About 15 minutes");
    expect(isOpenQueueStatus("waiting")).toBe(true);
    expect(isOpenQueueStatus("completed")).toBe(false);
  });
});
