import { describe, expect, it } from "vitest";

import {
  parseAppointmentFilter,
  summarizeAppointments,
} from "@/lib/appointments/types";

describe("appointment filters and availability counts", () => {
  it("defaults unknown filters to upcoming", () => {
    expect(parseAppointmentFilter("today")).toBe("today");
    expect(parseAppointmentFilter("yesterday")).toBe("upcoming");
  });

  it("summarizes a day's appointments for the staff board", () => {
    expect(
      summarizeAppointments([
        { status: "scheduled" },
        { status: "scheduled" },
        { status: "checked_in" },
        { status: "completed" },
        { status: "cancelled" },
        { status: "missed" },
      ])
    ).toEqual({
      total: 6,
      scheduled: 2,
      checkedIn: 1,
      completed: 1,
      cancelled: 1,
      missed: 1,
    });
  });
});
