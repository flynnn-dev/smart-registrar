export const USER_ROLES = ["student", "registrar", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  student: "Student",
  registrar: "Registrar",
  admin: "Admin",
};

export type AppUser = {
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  avatarUrl?: string | null;
};

export function isStaffRole(role: UserRole): boolean {
  return role === "registrar" || role === "admin";
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "SR";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const first = parts[0][0] ?? "";
  const last = parts[parts.length - 1][0] ?? "";

  return `${first}${last}`.toUpperCase();
}
