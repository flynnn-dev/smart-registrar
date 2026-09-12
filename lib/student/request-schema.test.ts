import { describe, expect, it } from "vitest";

import { documentRequestSchema } from "@/lib/student/request-schema";

const valid = {
  documentTypeId: "11111111-1111-4111-8111-111111111111",
  purpose: "For scholarship renewal this semester.",
  remarks: "",
  appointmentDate: "2026-09-15",
  appointmentTime: "10:00",
};

describe("documentRequestSchema", () => {
  it("accepts a complete request", () => {
    expect(documentRequestSchema.safeParse(valid).success).toBe(true);
    expect(
      documentRequestSchema.safeParse({
        ...valid,
        appointmentTime: "10:00:00",
      }).success
    ).toBe(true);
  });

  it("requires a document type, purpose, and appointment slot", () => {
    expect(
      documentRequestSchema.safeParse({
        ...valid,
        documentTypeId: "not-a-uuid",
      }).success
    ).toBe(false);
    expect(
      documentRequestSchema.safeParse({ ...valid, purpose: "too short" })
        .success
    ).toBe(false);
    expect(
      documentRequestSchema.safeParse({
        ...valid,
        appointmentDate: "09/15/2026",
      }).success
    ).toBe(false);
    expect(
      documentRequestSchema.safeParse({ ...valid, appointmentTime: "10" })
        .success
    ).toBe(false);
  });
});
