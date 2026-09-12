import { describe, expect, it } from "vitest";

import { parseNotificationFilter } from "@/lib/notifications/types";
import {
  notificationTargetPath,
  notificationsPathForRole,
} from "@/lib/notifications/paths";

describe("notification paths", () => {
  it("keeps students and staff on their own inboxes and request pages", () => {
    expect(notificationsPathForRole("student")).toBe("/student/notifications");
    expect(notificationsPathForRole("registrar")).toBe(
      "/registrar/notifications"
    );
    expect(notificationTargetPath("student", "abc")).toBe(
      "/student/requests/abc"
    );
    expect(notificationTargetPath("admin", "abc")).toBe(
      "/registrar/requests/abc"
    );
    expect(notificationTargetPath("student", null)).toBe(
      "/student/notifications"
    );
  });

  it("defaults unknown inbox filters to all", () => {
    expect(parseNotificationFilter("unread")).toBe("unread");
    expect(parseNotificationFilter("nope")).toBe("all");
  });
});
