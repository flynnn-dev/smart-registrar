import { describe, expect, it } from "vitest";

import { getInitials, isStaffRole } from "@/lib/roles";

describe("roles", () => {
  it("treats registrar and admin as staff, never the student role", () => {
    expect(isStaffRole("student")).toBe(false);
    expect(isStaffRole("registrar")).toBe(true);
    expect(isStaffRole("admin")).toBe(true);
  });

  it("builds initials from the display name", () => {
    expect(getInitials("Maria Santos")).toBe("MS");
    expect(getInitials("Ana")).toBe("AN");
    expect(getInitials("   ")).toBe("SR");
  });
});
