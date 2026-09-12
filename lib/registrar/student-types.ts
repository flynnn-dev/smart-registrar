import type { AppointmentStatus, RequestStatus } from "@/lib/status";

export type StudentAccountStatus = "active" | "idle";

export const STUDENT_ACCOUNT_STATUS_LABELS: Record<
  StudentAccountStatus,
  string
> = {
  active: "Active",
  idle: "No active requests",
};

export type StaffStudentLatestRequest = {
  id: string;
  requestNumber: string;
  documentName: string;
  status: RequestStatus;
};

export type StaffStudentSummary = {
  id: string;
  campusId: string | null;
  name: string;
  email: string;
  phone: string | null;
  requestCount: number;
  latestRequest: StaffStudentLatestRequest | null;
  accountStatus: StudentAccountStatus;
};

export type StaffStudentAppointment = {
  id: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  label: string;
  requestNumber: string | null;
  documentName: string | null;
};
