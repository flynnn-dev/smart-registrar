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

export function getAuthCallbackUrl(nextPath: string): string {
  const next = safeNextPath(nextPath, "/");
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
}
