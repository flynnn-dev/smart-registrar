import {
  parseRequestPage,
  sanitizeRequestSearch,
} from "@/lib/registrar/request-filters";
import {
  DOCUMENT_TYPE_ACTIVITY_FILTERS,
  type DocumentTypeActivityFilter,
} from "@/lib/registrar/document-type-types";

export const DOCUMENT_TYPE_PAGE_SIZE = 10;

export type StaffDocumentTypeFilters = {
  q: string;
  activity: DocumentTypeActivityFilter;
  page: number;
};

export function parseDocumentTypeActivity(
  value?: string
): DocumentTypeActivityFilter {
  return DOCUMENT_TYPE_ACTIVITY_FILTERS.includes(
    value as DocumentTypeActivityFilter
  )
    ? (value as DocumentTypeActivityFilter)
    : "all";
}

export function parseStaffDocumentTypeFilters(input: {
  q?: string;
  activity?: string;
  page?: string;
}): StaffDocumentTypeFilters {
  return {
    q: sanitizeRequestSearch(input.q),
    activity: parseDocumentTypeActivity(input.activity),
    page: parseRequestPage(input.page),
  };
}

export function staffDocumentTypesHref(
  filters: Partial<StaffDocumentTypeFilters>
): string {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }
  if (filters.activity && filters.activity !== "all") {
    params.set("activity", filters.activity);
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }

  const query = params.toString();
  return query ? `/registrar/documents?${query}` : "/registrar/documents";
}
