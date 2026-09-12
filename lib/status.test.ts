import { describe, expect, it } from "vitest";

import {
  canTransitionAppointment,
  canTransitionQueue,
  canTransitionRequest,
  isActiveRequestStatus,
  requestStatusActionLabel,
} from "@/lib/status";

describe("request status transitions", () => {
  it("allows the happy path through pickup", () => {
    expect(canTransitionRequest("submitted", "under_review")).toBe(true);
    expect(canTransitionRequest("under_review", "processing")).toBe(true);
    expect(canTransitionRequest("processing", "ready_for_pickup")).toBe(true);
    expect(canTransitionRequest("ready_for_pickup", "completed")).toBe(true);
  });

  it("allows rejection and reopen, but not skipping the pipeline", () => {
    expect(canTransitionRequest("submitted", "rejected")).toBe(true);
    expect(canTransitionRequest("rejected", "submitted")).toBe(true);
    expect(canTransitionRequest("rejected", "under_review")).toBe(true);
    expect(canTransitionRequest("submitted", "completed")).toBe(false);
    expect(canTransitionRequest("completed", "processing")).toBe(false);
  });

  it("treats a no-op as allowed", () => {
    expect(canTransitionRequest("processing", "processing")).toBe(true);
  });

  it("marks in-flight requests as active", () => {
    expect(isActiveRequestStatus("ready_for_pickup")).toBe(true);
    expect(isActiveRequestStatus("completed")).toBe(false);
    expect(isActiveRequestStatus("rejected")).toBe(false);
  });

  it("uses staff-facing action labels", () => {
    expect(requestStatusActionLabel("submitted", "under_review")).toBe(
      "Start review"
    );
    expect(requestStatusActionLabel("processing", "ready_for_pickup")).toBe(
      "Ready for pickup"
    );
    expect(requestStatusActionLabel("under_review", "rejected")).toBe(
      "Needs correction"
    );
  });
});

describe("appointment status transitions", () => {
  it("allows check-in and completion from a scheduled visit", () => {
    expect(canTransitionAppointment("scheduled", "checked_in")).toBe(true);
    expect(canTransitionAppointment("checked_in", "completed")).toBe(true);
    expect(canTransitionAppointment("scheduled", "cancelled")).toBe(true);
    expect(canTransitionAppointment("scheduled", "missed")).toBe(true);
  });

  it("blocks illegal jumps", () => {
    expect(canTransitionAppointment("scheduled", "completed")).toBe(false);
    expect(canTransitionAppointment("completed", "checked_in")).toBe(false);
    expect(canTransitionAppointment("cancelled", "scheduled")).toBe(false);
  });
});

describe("queue status transitions", () => {
  it("allows Call Next and window actions", () => {
    expect(canTransitionQueue("waiting", "serving")).toBe(true);
    expect(canTransitionQueue("serving", "completed")).toBe(true);
    expect(canTransitionQueue("waiting", "skipped")).toBe(true);
    expect(canTransitionQueue("skipped", "serving")).toBe(true);
    expect(canTransitionQueue("serving", "cancelled")).toBe(true);
  });

  it("blocks returning a finished number to the line", () => {
    expect(canTransitionQueue("completed", "waiting")).toBe(false);
    expect(canTransitionQueue("cancelled", "serving")).toBe(false);
    expect(canTransitionQueue("waiting", "completed")).toBe(false);
  });
});
