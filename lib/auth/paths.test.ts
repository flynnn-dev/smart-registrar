import { describe, expect, it } from "vitest";

import {
  fallbackPathForAuthType,
  homePathForRole,
  isProtectedPath,
  isStaffPath,
  isStudentPath,
  parseEmailOtpType,
  resolveAuthNextPath,
  safeNextPath,
} from "@/lib/auth/paths";

describe("role homes and route guards", () => {
  it("sends each role to its own dashboard", () => {
    expect(homePathForRole("student")).toBe("/student/dashboard");
    expect(homePathForRole("registrar")).toBe("/registrar/dashboard");
    expect(homePathForRole("admin")).toBe("/registrar/dashboard");
  });

  it("protects student, staff, and password-update routes", () => {
    expect(isProtectedPath("/student/dashboard")).toBe(true);
    expect(isProtectedPath("/registrar/queue")).toBe(true);
    expect(isProtectedPath("/update-password")).toBe(true);
    expect(isProtectedPath("/login")).toBe(false);
    expect(isProtectedPath("/")).toBe(false);
  });

  it("keeps student and registrar areas separate", () => {
    expect(isStudentPath("/student/requests")).toBe(true);
    expect(isStudentPath("/registrar/requests")).toBe(false);
    expect(isStaffPath("/registrar/dashboard")).toBe(true);
    expect(isStaffPath("/student/dashboard")).toBe(false);
  });
});

describe("safeNextPath", () => {
  it("accepts same-origin relative paths", () => {
    expect(safeNextPath("/student/queue?date=2026-09-14")).toBe(
      "/student/queue?date=2026-09-14"
    );
  });

  it("rejects open redirects", () => {
    expect(safeNextPath("https://evil.example/phish")).toBe("/");
    expect(safeNextPath("//evil.example")).toBe("/");
    expect(safeNextPath("/\\evil.example")).toBe("/");
    expect(safeNextPath("student/dashboard")).toBe("/");
  });

  it("falls back when the value is missing or malformed", () => {
    expect(safeNextPath(null, "/login")).toBe("/login");
    expect(safeNextPath("%E0%A4%A", "/login")).toBe("/login");
  });
});

describe("email confirmation redirects", () => {
  it("reads next from a confirmation or callback URL", () => {
    expect(
      resolveAuthNextPath(
        "https://smart-registrar.vercel.app/auth/callback?next=%2Fstudent%2Fdashboard",
        "/"
      )
    ).toBe("/student/dashboard");
    expect(
      resolveAuthNextPath(
        "http://localhost:3000/auth/confirm?next=/update-password",
        "/"
      )
    ).toBe("/update-password");
  });

  it("rejects foreign redirect targets", () => {
    expect(resolveAuthNextPath("https://evil.example/phish", "/login")).toBe(
      "/login"
    );
    expect(parseEmailOtpType("email")).toBe("email");
    expect(parseEmailOtpType("not-a-type")).toBeNull();
    expect(fallbackPathForAuthType("recovery")).toBe("/update-password");
    expect(fallbackPathForAuthType("signup")).toBe("/student/dashboard");
  });
});
