import type { AppointmentStatus, RequestStatus } from "@/lib/status";
import type { ProgressStep, RequestHistoryEvent } from "@/lib/requests/progress";

export const REQUEST_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type RequestSummary = {
  id: string;
  requestNumber: string;
  documentName: string;
  status: RequestStatus;
  purpose: string | null;
  submittedAt: string;
  appointmentLabel: string | null;
  queueNumber: string | null;
};

export type RequestDetail = RequestSummary & {
  remarks: string | null;
  completedAt: string | null;
  updatedAt: string;
  appointmentStatus: AppointmentStatus | null;
  queueDate: string | null;
  history: RequestHistoryEvent[];
  progress: ProgressStep[];
};
