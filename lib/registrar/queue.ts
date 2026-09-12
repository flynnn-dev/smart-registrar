import "server-only";

import {
  QUEUE_SELECT,
  boardFromEntries,
  toQueueRecord,
  type QueueQueryRow,
} from "@/lib/queue/query";
import {
  parseQueueDate,
  type QueueBoard,
  type QueueRecord,
} from "@/lib/queue/types";
import { schoolCalendarDate } from "@/lib/format/datetime";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type RegistrarQueueData = {
  date: string;
  today: string;
  dates: string[];
  entries: QueueRecord[];
  board: QueueBoard;
};

export async function getRegistrarQueue(
  requestedDate?: string
): Promise<RegistrarQueueData> {
  const supabase = await createSupabaseServerClient();
  const today = schoolCalendarDate();
  const date = parseQueueDate(requestedDate);

  const [listResult, datesResult] = await Promise.all([
    supabase
      .from("queue_entries")
      .select(QUEUE_SELECT)
      .eq("queue_date", date)
      .order("queue_number", { ascending: true }),
    supabase
      .from("queue_entries")
      .select("queue_date")
      .order("queue_date", { ascending: true }),
  ]);

  if (listResult.error) {
    throw new Error(`Unable to load the queue: ${listResult.error.message}`);
  }

  if (datesResult.error) {
    throw new Error(
      `Unable to load queue dates: ${datesResult.error.message}`
    );
  }

  const entries = ((listResult.data ?? []) as QueueQueryRow[]).map((row) =>
    toQueueRecord(row)
  );
  const dates = [
    ...new Set(
      [today, date, ...(datesResult.data ?? []).map((row) => row.queue_date)]
    ),
  ].sort();

  return {
    date,
    today,
    dates,
    entries,
    board: boardFromEntries(date, entries),
  };
}
