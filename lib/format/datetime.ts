export const SCHOOL_TIME_ZONE = "Asia/Manila";

export function getDayGreeting(
  now = new Date()
): "Good morning" | "Good afternoon" | "Good evening" {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: SCHOOL_TIME_ZONE,
      hour: "numeric",
      hourCycle: "h23",
    }).format(now)
  );

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function firstNameFromFullName(fullName: string | null): string {
  const first = fullName?.trim().split(/\s+/)[0];
  return first || "there";
}

function clockParts(time: string): { hour: number; minute: number } {
  const [hour, minute] = time.split(":");
  return { hour: Number(hour), minute: Number(minute ?? "0") };
}

export function formatClock(time: string): string {
  const { hour, minute } = clockParts(time);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export function formatCalendarDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const utcNoon = new Date(Date.UTC(year, month - 1, day, 12));

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(utcNoon);
}

export function formatAppointmentSlot(date: string, time: string): string {
  return `${formatCalendarDate(date)} · ${formatClock(time)}`;
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: SCHOOL_TIME_ZONE,
  }).format(new Date(value));
}

export function formatRelativeTime(value: string, now = new Date()): string {
  const elapsed = Math.max(0, now.getTime() - new Date(value).getTime());
  const minutes = Math.floor(elapsed / 60_000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDateTime(value);
}

export function formatProcessingDays(days: number): string {
  return days === 1 ? "About 1 business day" : `About ${days} business days`;
}

export function schoolCalendarDate(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SCHOOL_TIME_ZONE,
  }).format(now);
}

export function toSchoolCalendarDate(value: string): string {
  return schoolCalendarDate(new Date(value));
}

export function formatShortCalendarDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const utcNoon = new Date(Date.UTC(year, month - 1, day, 12));

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(utcNoon);
}

export function formatReportDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const utcNoon = new Date(Date.UTC(year, month - 1, day, 12));

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcNoon);
}

export function formatMonthYear(date: string): string {
  const [year, month] = date.split("-").map(Number);
  const utcNoon = new Date(Date.UTC(year, month - 1, 1, 12));

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcNoon);
}

const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;

export function schoolDayBounds(date = schoolCalendarDate()): {
  start: string;
  end: string;
} {
  const [year, month, day] = date.split("-").map(Number);
  const startUtc = Date.UTC(year, month - 1, day) - MANILA_OFFSET_MS;

  return {
    start: new Date(startUtc).toISOString(),
    end: new Date(startUtc + 86_400_000).toISOString(),
  };
}

export function addCalendarDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const utcNoon = new Date(Date.UTC(year, month - 1, day + days, 12));

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
  }).format(utcNoon);
}

export function startOfSchoolWeek(date = schoolCalendarDate()): string {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
  const offset = weekday === 0 ? 6 : weekday - 1;
  return addCalendarDays(date, -offset);
}

export function startOfSchoolMonth(date = schoolCalendarDate()): string {
  return `${date.slice(0, 7)}-01`;
}
