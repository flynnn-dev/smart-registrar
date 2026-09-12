import { describe, expect, it } from "vitest";

import {
  addCalendarDays,
  formatAppointmentSlot,
  formatCalendarDate,
  formatClock,
  formatProcessingDays,
  formatRelativeTime,
  getDayGreeting,
  schoolCalendarDate,
  schoolDayBounds,
  startOfSchoolMonth,
  startOfSchoolWeek,
} from "@/lib/format/datetime";

describe("school calendar (Asia/Manila)", () => {
  it("rolls the date at midnight in Manila, not UTC", () => {
    expect(schoolCalendarDate(new Date("2026-09-12T15:59:00.000Z"))).toBe(
      "2026-09-12"
    );
    expect(schoolCalendarDate(new Date("2026-09-12T16:00:00.000Z"))).toBe(
      "2026-09-13"
    );
  });

  it("greets from Manila wall time", () => {
    expect(getDayGreeting(new Date("2026-09-12T00:30:00.000Z"))).toBe(
      "Good morning"
    );
    expect(getDayGreeting(new Date("2026-09-12T06:30:00.000Z"))).toBe(
      "Good afternoon"
    );
    expect(getDayGreeting(new Date("2026-09-12T12:30:00.000Z"))).toBe(
      "Good evening"
    );
  });

  it("walks dates and week bounds without shifting the weekday", () => {
    expect(addCalendarDays("2026-09-14", 1)).toBe("2026-09-15");
    expect(startOfSchoolWeek("2026-09-16")).toBe("2026-09-14");
    expect(startOfSchoolMonth("2026-09-16")).toBe("2026-09-01");
  });

  it("returns exclusive Manila day bounds", () => {
    expect(schoolDayBounds("2026-09-14")).toEqual({
      start: "2026-09-13T16:00:00.000Z",
      end: "2026-09-14T16:00:00.000Z",
    });
  });
});

describe("display formatters", () => {
  it("formats appointment slots in a stable UTC calendar", () => {
    expect(formatCalendarDate("2026-09-14")).toBe("Mon, Sep 14");
    expect(formatClock("09:30")).toBe("9:30 AM");
    expect(formatAppointmentSlot("2026-09-14", "09:30")).toBe(
      "Mon, Sep 14 · 9:30 AM"
    );
    expect(formatProcessingDays(1)).toBe("About 1 business day");
    expect(formatProcessingDays(3)).toBe("About 3 business days");
  });

  it("formats relative time from a fixed now", () => {
    const now = new Date("2026-09-12T10:00:00.000Z");

    expect(formatRelativeTime("2026-09-12T09:59:30.000Z", now)).toBe(
      "Just now"
    );
    expect(formatRelativeTime("2026-09-12T09:40:00.000Z", now)).toBe("20m ago");
    expect(formatRelativeTime("2026-09-12T07:00:00.000Z", now)).toBe("3h ago");
  });
});
