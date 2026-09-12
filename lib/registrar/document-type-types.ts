export const DOCUMENT_TYPE_ACTIVITY_FILTERS = [
  "all",
  "active",
  "inactive",
] as const;

export type DocumentTypeActivityFilter =
  (typeof DOCUMENT_TYPE_ACTIVITY_FILTERS)[number];

export const DOCUMENT_TYPE_ACTIVITY_LABELS: Record<
  DocumentTypeActivityFilter,
  string
> = {
  all: "All types",
  active: "Active",
  inactive: "Inactive",
};

export type StaffDocumentType = {
  id: string;
  name: string;
  description: string | null;
  processingDays: number;
  isActive: boolean;
  requestCount: number;
  updatedAt: string;
};
