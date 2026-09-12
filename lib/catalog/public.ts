import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PublicDocumentType = {
  id: string;
  name: string;
  description: string | null;
  processing_days: number;
};

export type PublicOfficeHours = {
  day_of_week: number;
  start_time: string;
  end_time: string;
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function formatClock(value: string): string {
  const [hourPart, minutePart] = value.split(":");
  const hour = Number(hourPart);
  const minute = (minutePart ?? "00").slice(0, 2);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minute} ${suffix}`;
}

export function summarizeOfficeHours(rows: PublicOfficeHours[]): string | null {
  if (rows.length === 0) {
    return null;
  }

  const first = rows[0];
  const sameWindow = rows.every(
    (row) => row.start_time === first.start_time && row.end_time === first.end_time
  );

  if (sameWindow) {
    const startDay = DAY_NAMES[rows[0].day_of_week];
    const endDay = DAY_NAMES[rows[rows.length - 1].day_of_week];
    return `${startDay}–${endDay}, ${formatClock(first.start_time)} – ${formatClock(first.end_time)}`;
  }

  return rows
    .map(
      (row) =>
        `${DAY_NAMES[row.day_of_week]} ${formatClock(row.start_time)} – ${formatClock(row.end_time)}`
    )
    .join(" · ");
}

export async function getPublicDocumentTypes(): Promise<PublicDocumentType[]> {
  if (!getSupabasePublicEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("document_types")
    .select("id, name, description, processing_days")
    .eq("is_active", true)
    .order("name");

  return data ?? [];
}

export async function getPublicOfficeHours(): Promise<PublicOfficeHours[]> {
  if (!getSupabasePublicEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("operating_hours")
    .select("day_of_week, start_time, end_time")
    .eq("is_active", true)
    .order("day_of_week");

  return data ?? [];
}
