import { isStaffRole, type UserRole } from "@/lib/roles";

export function notificationsPathForRole(role: UserRole): string {
  return isStaffRole(role) ? "/registrar/notifications" : "/student/notifications";
}

export function notificationTargetPath(
  role: UserRole,
  requestId: string | null
): string {
  if (!requestId) {
    return notificationsPathForRole(role);
  }

  return isStaffRole(role)
    ? `/registrar/requests/${requestId}`
    : `/student/requests/${requestId}`;
}
