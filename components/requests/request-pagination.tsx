import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  REQUEST_PAGE_SIZE,
  staffRequestsHref,
  type StaffRequestFilters,
} from "@/lib/registrar/request-filters";
import { cn } from "@/lib/utils";

type RequestPaginationProps = {
  filters: StaffRequestFilters;
  total: number;
  pageCount: number;
};

export function RequestPagination({
  filters,
  total,
  pageCount,
}: RequestPaginationProps) {
  if (total <= REQUEST_PAGE_SIZE) {
    return (
      <p className="text-sm text-muted-foreground">
        {total === 1 ? "1 request" : `${total} requests`}
      </p>
    );
  }

  const from = (filters.page - 1) * REQUEST_PAGE_SIZE + 1;
  const to = Math.min(filters.page * REQUEST_PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {from}–{to} of {total} requests
      </p>
      <div className="flex gap-2">
        <Link
          href={staffRequestsHref({ ...filters, page: Math.max(1, filters.page - 1) })}
          aria-disabled={filters.page <= 1}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            filters.page <= 1 && "pointer-events-none opacity-50"
          )}
        >
          Previous
        </Link>
        <Link
          href={staffRequestsHref({
            ...filters,
            page: Math.min(pageCount, filters.page + 1),
          })}
          aria-disabled={filters.page >= pageCount}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            filters.page >= pageCount && "pointer-events-none opacity-50"
          )}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
