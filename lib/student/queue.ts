import "server-only";

import {
  QUEUE_SELECT,
  toQueueBoard,
  toQueueRecord,
  type QueueBoardRow,
  type QueueQueryRow,
} from "@/lib/queue/query";
import {
  emptyQueueBoard,
  isOpenQueueStatus,
  parseQueueDate,
  type QueueBoard,
  type QueueRecord,
} from "@/lib/queue/types";
import { schoolCalendarDate } from "@/lib/format/datetime";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StudentQueueData = {
  tickets: QueueRecord[];
  upcoming: QueueRecord[];
  past: QueueRecord[];
  dates: string[];
  date: string;
  board: QueueBoard;
};

function pickFeaturedDate(tickets: QueueRecord[], requested?: string): string {
  const today = schoolCalendarDate();
  const dates = [...new Set(tickets.map((ticket) => ticket.date))].sort();

  if (requested && dates.includes(requested)) {
    return requested;
  }

  const open = tickets.filter((ticket) => isOpenQueueStatus(ticket.status));
  const todayOpen = open.find((ticket) => ticket.date === today);

  if (todayOpen) {
    return today;
  }

  const futureOpen = open
    .filter((ticket) => ticket.date > today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.number.localeCompare(b.number));

  if (futureOpen[0]) {
    return futureOpen[0].date;
  }

  const future = tickets
    .filter((ticket) => ticket.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.number.localeCompare(b.number));

  if (future[0]) {
    return future[0].date;
  }

  return dates[dates.length - 1] ?? today;
}

export async function getStudentQueue(
  studentName: string,
  requestedDate?: string
): Promise<StudentQueueData> {
  const supabase = await createSupabaseServerClient();
  const today = schoolCalendarDate();
  const requested = requestedDate ? parseQueueDate(requestedDate) : undefined;

  const { data, error } = await supabase
    .from("queue_entries")
    .select(QUEUE_SELECT)
    .order("queue_date", { ascending: true })
    .order("queue_number", { ascending: true });

  if (error) {
    throw new Error(`Unable to load queue tickets: ${error.message}`);
  }

  const tickets = ((data ?? []) as QueueQueryRow[]).map((row) =>
    toQueueRecord(row, studentName)
  );
  const date = pickFeaturedDate(tickets, requested);
  const upcoming = tickets.filter(
    (ticket) => ticket.date >= today && isOpenQueueStatus(ticket.status)
  );
  const past = tickets.filter(
    (ticket) => ticket.date < today || !isOpenQueueStatus(ticket.status)
  );

  if (tickets.length === 0) {
    return {
      tickets,
      upcoming,
      past,
      dates: [],
      date,
      board: emptyQueueBoard(date),
    };
  }

  const { data: boardRows, error: boardError } = await supabase.rpc(
    "get_queue_board",
    { p_date: date }
  );

  const dates = [...new Set(tickets.map((ticket) => ticket.date))].sort();
  const dayTickets = tickets.filter((ticket) => ticket.date === date);
  const featured =
    dayTickets.find((ticket) => ticket.status === "serving") ??
    dayTickets.find((ticket) => ticket.status === "waiting") ??
    dayTickets[0] ??
    null;
  const fallbackBoard = {
    ...emptyQueueBoard(date),
    servingNumber:
      dayTickets.find((ticket) => ticket.status === "serving")?.number ?? null,
    yourNumber: featured?.number ?? null,
    yourStatus: featured?.status ?? null,
    peopleAhead: featured?.status === "serving" ? 0 : null,
    estimatedWaitMinutes: featured?.status === "serving" ? 0 : null,
  };

  if (boardError) {
    return {
      tickets,
      upcoming,
      past,
      dates,
      date,
      board: fallbackBoard,
    };
  }

  return {
    tickets,
    upcoming,
    past,
    dates,
    date,
    board: toQueueBoard(date, (boardRows?.[0] ?? null) as QueueBoardRow | null),
  };
}
