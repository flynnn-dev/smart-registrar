import { describe, expect, it } from "vitest";

import { documentTypeSchema } from "@/lib/registrar/document-type-schema";

describe("documentTypeSchema", () => {
  it("accepts a staff document type", () => {
    expect(
      documentTypeSchema.safeParse({
        name: "Transcript of Records",
        description: "Official TOR",
        processingDays: 5,
        isActive: true,
      }).success
    ).toBe(true);
  });

  it("rejects a negative or fractional processing time", () => {
    expect(
      documentTypeSchema.safeParse({
        name: "TOR",
        description: "",
        processingDays: -1,
        isActive: true,
      }).success
    ).toBe(false);
    expect(
      documentTypeSchema.safeParse({
        name: "TOR",
        description: "",
        processingDays: 1.5,
        isActive: true,
      }).success
    ).toBe(false);
  });
});
