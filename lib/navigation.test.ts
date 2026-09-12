import { describe, expect, it } from "vitest";

import {
  matchNavItem,
  studentNavigation,
  studentTabNavigation,
  titleForPath,
} from "@/lib/navigation";

describe("matchNavItem", () => {
  it("prefers the longest matching student route", () => {
    expect(matchNavItem("/student/requests/new", studentNavigation)?.href).toBe(
      "/student/requests/new"
    );
    expect(
      matchNavItem("/student/requests/new/success", studentTabNavigation)?.href
    ).toBe("/student/requests/new");
    expect(
      matchNavItem("/student/requests/abc-def", studentTabNavigation)?.href
    ).toBe("/student/requests");
  });

  it("leaves profile and notifications off the tab bar", () => {
    expect(
      matchNavItem("/student/profile", studentTabNavigation)
    ).toBeUndefined();
    expect(
      matchNavItem("/student/notifications", studentTabNavigation)
    ).toBeUndefined();
  });
});

describe("titleForPath", () => {
  it("uses the matched student label", () => {
    expect(
      titleForPath("/student/requests/new", studentNavigation, "Student")
    ).toBe("New Request");
  });
});
