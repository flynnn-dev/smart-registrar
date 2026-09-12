import { describe, expect, it } from "vitest";

import {
  matchNavItem,
  studentNavigation,
  studentPageTitles,
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

  it("leaves profile off the sidebar", () => {
    expect(studentNavigation.some((item) => item.href === "/student/profile")).toBe(
      false
    );
  });
});

describe("titleForPath", () => {
  it("uses the matched student label", () => {
    expect(
      titleForPath("/student/requests/new", studentPageTitles, "Student")
    ).toBe("New Request");
    expect(titleForPath("/student/profile", studentPageTitles, "Student")).toBe(
      "Profile"
    );
  });
});
