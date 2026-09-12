import { REQUEST_STATUSES, type RequestStatus } from "@/lib/status";

export const REQUEST_DATE_FILTERS = ["all", "today", "week", "month"] as const;
export const REQUEST_SORTS = ["submitted", "number", "status"] as const;
export const REQUEST_PAGE_SIZE = 10;

export type RequestDateFilter = (typeof REQUEST_DATE_FILTERS)[number];
export type RequestSort = (typeof REQUEST_SORTS)[number];

export const REQUEST_DATE_FILTER_LABELS: Record<RequestDateFilter, string> = {
  all: "All dates",
  today: "Today",
  week: "This week",
  month: "This month",
};

export const REQUEST_SORT_LABELS: Record<RequestSort, string> = {
  submitted: "Submitted",
  number: "Request #",
  status: "Status",
};

export type StaffRequestFilters = {
  q: string;
  status: RequestStatus | "all";
  documentTypeId: string;
  date: RequestDateFilter;
  sort: RequestSort;
  page: number;
};

export function parseRequestStatusFilter(
  value?: string
): RequestStatus | "all" {
  return REQUEST_STATUSES.includes(value as RequestStatus)
    ? (value as RequestStatus)
    : "all";
}

export function parseRequestDateFilter(value?: string): RequestDateFilter {
  return REQUEST_DATE_FILTERS.includes(value as RequestDateFilter)
    ? (value as RequestDateFilter)
    : "all";
}

export function parseRequestSort(value?: string): RequestSort {
  return REQUEST_SORTS.includes(value as RequestSort)
    ? (value as RequestSort)
    : "submitted";
}

export function parseRequestPage(value?: string): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function sanitizeRequestSearch(value?: string): string {
  return (value ?? "")
    .trim()
    .slice(0, 80)
    .replace(/[%_,()]/g, " ")
    .replace(/\s+/g, " ");
}

export function parseStaffRequestFilters(input: {
  q?: string;
  status?: string;
  document?: string;
  date?: string;
  sort?: string;
  page?: string;
}): StaffRequestFilters {
  const documentTypeId =
    input.document &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      input.document
    )
      ? input.document
      : "";

  return {
    q: sanitizeRequestSearch(input.q),
    status: parseRequestStatusFilter(input.status),
    documentTypeId,
    date: parseRequestDateFilter(input.date),
    sort: parseRequestSort(input.sort),
    page: parseRequestPage(input.page),
  };
}

export function staffRequestsHref(
  filters: Partial<StaffRequestFilters> & {
    document?: string;
  }
): string {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }
  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.documentTypeId) {
    params.set("document", filters.documentTypeId);
  }
  if (filters.date && filters.date !== "all") {
    params.set("date", filters.date);
  }
  if (filters.sort && filters.sort !== "submitted") {
    params.set("sort", filters.sort);
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }

  const query = params.toString();
  return query ? `/registrar/requests?${query}` : "/registrar/requests";
}
