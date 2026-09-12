import type { UserRole } from "@/lib/roles";

const PROTECTED_PREFIXES = ["/student", "/registrar"] as const;
const PROTECTED_EXACT_PATHS = ["/update-password"] as const;

export function homePathForRole(role: UserRole): string {
  return role === "student" ? "/student/dashboard" : "/registrar/dashboard";
}

export function isProtectedPath(pathname: string): boolean {
  return (
    PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    PROTECTED_EXACT_PATHS.includes(
      pathname as (typeof PROTECTED_EXACT_PATHS)[number]
    )
  );
}

export function isStaffPath(pathname: string): boolean {
  return pathname.startsWith("/registrar");
}

export function isStudentPath(pathname: string): boolean {
  return pathname.startsWith("/student");
}

const EMAIL_OTP_TYPES = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
] as const;

export type EmailOtpType = (typeof EMAIL_OTP_TYPES)[number];

export function parseEmailOtpType(
  value: string | null | undefined
): EmailOtpType | null {
  if (!value) {
    return null;
  }

  return EMAIL_OTP_TYPES.includes(value as EmailOtpType)
    ? (value as EmailOtpType)
    : null;
}

export function fallbackPathForAuthType(type: EmailOtpType | null): string {
  if (type === "recovery") {
    return "/update-password";
  }

  if (type === "signup" || type === "email" || type === "invite") {
    return homePathForRole("student");
  }

  return "/";
}

export function safeNextPath(
  value: string | null | undefined,
  fallback = "/"
): string {
  if (!value) {
    return fallback;
  }

  let decoded = value;

  try {
    decoded = decodeURIComponent(value);
  } catch {
    return fallback;
  }

  if (!decoded.startsWith("/")) {
    return fallback;
  }

  if (decoded.startsWith("//") || decoded.includes("://") || decoded.includes("\\")) {
    return fallback;
  }

  return decoded;
}

export function resolveAuthNextPath(
  value: string | null | undefined,
  fallback = "/"
): string {
  const relative = safeNextPath(value, "");

  if (relative) {
    return relative;
  }

  if (!value) {
    return fallback;
  }

  let decoded = value;

  try {
    decoded = decodeURIComponent(value);
  } catch {
    return fallback;
  }

  try {
    const url = new URL(decoded);

    if (url.pathname === "/auth/callback" || url.pathname === "/auth/confirm") {
      return safeNextPath(url.searchParams.get("next"), fallback);
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export function getAuthCallbackUrl(nextPath: string): string {
  const next = safeNextPath(nextPath, "/");
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
}
