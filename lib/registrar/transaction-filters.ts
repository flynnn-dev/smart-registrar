import {
  addCalendarDays,
  schoolCalendarDate,
  schoolDayBounds,
  startOfSchoolMonth,
  startOfSchoolWeek,
} from "@/lib/format/datetime";
import {
  parseRequestDateFilter,
  parseRequestPage,
  sanitizeRequestSearch,
  type RequestDateFilter,
} from "@/lib/registrar/request-filters";
import {
  TRANSACTION_ACTIONS,
  type TransactionAction,
} from "@/lib/registrar/transaction-types";

export const TRANSACTION_PAGE_SIZE = 10;

export type StaffTransactionFilters = {
  q: string;
  action: TransactionAction | "all";
  date: RequestDateFilter;
  page: number;
};

export function parseTransactionActionFilter(
  value?: string
): TransactionAction | "all" {
  return TRANSACTION_ACTIONS.includes(value as TransactionAction)
    ? (value as TransactionAction)
    : "all";
}

export function parseStaffTransactionFilters(input: {
  q?: string;
  action?: string;
  date?: string;
  page?: string;
}): StaffTransactionFilters {
  return {
    q: sanitizeRequestSearch(input.q),
    action: parseTransactionActionFilter(input.action),
    date: parseRequestDateFilter(input.date),
    page: parseRequestPage(input.page),
  };
}

export function transactionDateBounds(filter: RequestDateFilter): {
  start?: string;
  end?: string;
} {
  if (filter === "all") {
    return {};
  }

  const today = schoolCalendarDate();

  if (filter === "today") {
    return schoolDayBounds(today);
  }

  if (filter === "week") {
    return {
      start: schoolDayBounds(startOfSchoolWeek(today)).start,
      end: schoolDayBounds(addCalendarDays(startOfSchoolWeek(today), 7)).start,
    };
  }

  const monthStart = startOfSchoolMonth(today);
  const nextMonth = `${addCalendarDays(monthStart, 32).slice(0, 7)}-01`;

  return {
    start: schoolDayBounds(monthStart).start,
    end: schoolDayBounds(nextMonth).start,
  };
}

export function staffTransactionsHref(
  filters: Partial<StaffTransactionFilters>
): string {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }
  if (filters.action && filters.action !== "all") {
    params.set("action", filters.action);
  }
  if (filters.date && filters.date !== "all") {
    params.set("date", filters.date);
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }

  const query = params.toString();
  return query
    ? `/registrar/transactions?${query}`
    : "/registrar/transactions";
}
