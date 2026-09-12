import type {
  DocumentTypePoint,
  StatusSlice,
  VolumePoint,
} from "@/lib/registrar/dashboard-types";
import type { RequestStatus } from "@/lib/status";

export type ReportPeriod = "today" | "week" | "month" | "custom";

export const REPORT_PERIODS = ["today", "week", "month", "custom"] as const;

export const REPORT_PERIOD_LABELS: Record<ReportPeriod, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
  custom: "Custom range",
};

export type StaffReportFilters = {
  period: ReportPeriod;
  from: string;
  to: string;
};

export type ReportRequestRow = {
  id: string;
  requestNumber: string;
  documentName: string;
  status: RequestStatus;
  submittedAt: string;
  studentUserId: string | null;
  studentName: string | null;
  studentCampusId: string | null;
};

export type StaffReportStats = {
  dailyRequests: number;
  dailyIsAverage: boolean;
  monthlyRequests: number;
  completed: number;
  pending: number;
};

export type StaffReportData = {
  rangeLabel: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  volumeKind: "daily" | "monthly";
  volume: VolumePoint[];
  statusDistribution: StatusSlice[];
  documentTypes: DocumentTypePoint[];
  requests: ReportRequestRow[];
  total: number;
  truncated: boolean;
  stats: StaffReportStats;
};
