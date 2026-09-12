import { describe, expect, it } from "vitest";

import {
  parseStaffRequestFilters,
  sanitizeRequestSearch,
  staffRequestsHref,
} from "@/lib/registrar/request-filters";

describe("staff request filters", () => {
  it("strips wildcard characters from search", () => {
    expect(sanitizeRequestSearch("  REG-2026_%0001  ")).toBe("REG-2026 0001");
  });

  it("falls back to safe defaults", () => {
    expect(
      parseStaffRequestFilters({
        status: "hacked",
        date: "forever",
        sort: "secret",
        page: "0",
        document: "not-a-uuid",
      })
    ).toMatchObject({
      status: "all",
      date: "all",
      sort: "submitted",
      page: 1,
      documentTypeId: "",
    });
  });

  it("omits default query params from the href", () => {
    expect(staffRequestsHref({ status: "all", page: 1 })).toBe(
      "/registrar/requests"
    );
    expect(
      staffRequestsHref({ status: "processing", page: 2, q: "TOR" })
    ).toBe("/registrar/requests?q=TOR&status=processing&page=2");
  });
});
