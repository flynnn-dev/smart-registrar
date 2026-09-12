import type { RequestStatus } from "@/lib/status";

export type RegistrarDashboardStats = {
  todaysRequests: number;
  pendingRequests: number;
  processing: number;
  readyForPickup: number;
  completedToday: number;
};

export type RegistrarTodayWindow = {
  servingNumber: string | null;
  waitingCount: number;
  appointmentsToday: number;
  appointmentsOpen: number;
};

export type VolumePoint = {
  date: string;
  label: string;
  count: number;
};

export type StatusSlice = {
  status: RequestStatus;
  label: string;
  count: number;
  color: string;
};

export type DocumentTypePoint = {
  name: string;
  count: number;
};

export type RegistrarDashboardData = {
  stats: RegistrarDashboardStats;
  today: RegistrarTodayWindow;
  volume: VolumePoint[];
  statusDistribution: StatusSlice[];
  documentTypes: DocumentTypePoint[];
};
