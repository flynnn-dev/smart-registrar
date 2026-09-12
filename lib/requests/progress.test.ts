import { describe, expect, it } from "vitest";

import { buildRequestProgress } from "@/lib/requests/progress";

const submittedAt = "2026-09-01T01:00:00.000Z";

describe("buildRequestProgress", () => {
  it("marks the current pipeline step and later ones as waiting", () => {
    const steps = buildRequestProgress(
      "processing",
      [
        {
          id: "1",
          oldStatus: null,
          newStatus: "submitted",
          remarks: null,
          createdAt: submittedAt,
        },
        {
          id: "2",
          oldStatus: "submitted",
          newStatus: "under_review",
          remarks: null,
          createdAt: "2026-09-02T01:00:00.000Z",
        },
        {
          id: "3",
          oldStatus: "under_review",
          newStatus: "processing",
          remarks: null,
          createdAt: "2026-09-03T01:00:00.000Z",
        },
      ],
      submittedAt
    );

    expect(steps.map((step) => [step.status, step.state])).toEqual([
      ["submitted", "complete"],
      ["under_review", "complete"],
      ["processing", "current"],
      ["ready_for_pickup", "upcoming"],
      ["completed", "upcoming"],
    ]);
  });

  it("appends rejection as a branch off the last reached step", () => {
    const steps = buildRequestProgress(
      "rejected",
      [
        {
          id: "1",
          oldStatus: null,
          newStatus: "submitted",
          remarks: null,
          createdAt: submittedAt,
        },
        {
          id: "2",
          oldStatus: "submitted",
          newStatus: "under_review",
          remarks: null,
          createdAt: "2026-09-02T01:00:00.000Z",
        },
        {
          id: "3",
          oldStatus: "under_review",
          newStatus: "rejected",
          remarks: "Missing ID photocopy",
          createdAt: "2026-09-03T01:00:00.000Z",
        },
      ],
      submittedAt
    );

    expect(steps.at(-1)).toMatchObject({
      status: "rejected",
      state: "rejected",
      remarks: "Missing ID photocopy",
    });
    expect(steps.map((step) => step.status)).toEqual([
      "submitted",
      "under_review",
      "rejected",
    ]);
  });
});
