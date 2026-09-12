import { describe, expect, it } from "vitest";

import {
  loginSchema,
  profileSchema,
  registerSchema,
  updatePasswordSchema,
} from "@/lib/auth/schemas";

describe("loginSchema", () => {
  it("accepts a complete login", () => {
    const result = loginSchema.safeParse({
      email: "maria.santos.phase4@university.edu",
      password: "RegistrarDemo1!",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a missing password and a bad email", () => {
    expect(
      loginSchema.safeParse({ email: "not-an-email", password: "x" }).success
    ).toBe(false);
    expect(
      loginSchema.safeParse({
        email: "maria.santos.phase4@university.edu",
        password: "",
      }).success
    ).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    fullName: "Maria Santos",
    studentId: "2026-00123",
    email: "maria.santos.phase4@university.edu",
    phone: "09171234567",
    password: "RegistrarDemo1!",
    confirmPassword: "RegistrarDemo1!",
  };

  it("accepts a complete student signup", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a school student id and matching passwords", () => {
    expect(
      registerSchema.safeParse({ ...valid, studentId: "2026" }).success
    ).toBe(false);
    expect(
      registerSchema.safeParse({
        ...valid,
        confirmPassword: "different",
      }).success
    ).toBe(false);
  });

  it("allows an empty phone number", () => {
    expect(registerSchema.safeParse({ ...valid, phone: "" }).success).toBe(true);
  });
});

describe("profile and password forms", () => {
  it("requires a student id on the profile", () => {
    expect(
      profileSchema.safeParse({
        fullName: "Maria Santos",
        studentId: "bad",
        phone: "",
      }).success
    ).toBe(false);
  });

  it("requires the new password to be confirmed", () => {
    expect(
      updatePasswordSchema.safeParse({
        password: "RegistrarDemo1!",
        confirmPassword: "RegistrarDemo2!",
      }).success
    ).toBe(false);
  });
});
