import { describe, expect, it } from "vitest";

import { getAuthErrorMessage } from "@/lib/auth/errors";

describe("getAuthErrorMessage", () => {
  it("maps common auth failures to safe copy", () => {
    expect(
      getAuthErrorMessage({ code: "invalid_credentials" })
    ).toBe("Email or password is incorrect.");
    expect(
      getAuthErrorMessage({ message: "Email not confirmed" })
    ).toBe("Confirm your email before signing in.");
    expect(
      getAuthErrorMessage({ message: "User already registered" })
    ).toBe("An account with this email already exists.");
    expect(
      getAuthErrorMessage({ message: "duplicate key profiles_student_id" })
    ).toBe("This student ID is already registered.");
  });

  it("does not leak raw database or permission errors", () => {
    expect(
      getAuthErrorMessage({ message: "permission denied for table profiles" })
    ).toBe("You do not have permission to update this profile.");
    expect(getAuthErrorMessage({ message: "something obscure" })).toBe(
      "Something went wrong. Please try again."
    );
  });
});
