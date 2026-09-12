import {
  parseRequestPage,
  sanitizeRequestSearch,
} from "@/lib/registrar/request-filters";

export const STUDENT_PAGE_SIZE = 10;

export type StaffStudentFilters = {
  q: string;
  page: number;
};

export function parseStaffStudentFilters(input: {
  q?: string;
  page?: string;
}): StaffStudentFilters {
  return {
    q: sanitizeRequestSearch(input.q),
    page: parseRequestPage(input.page),
  };
}

export function staffStudentsHref(
  filters: Partial<StaffStudentFilters>
): string {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }

  const query = params.toString();
  return query ? `/registrar/students?${query}` : "/registrar/students";
}
