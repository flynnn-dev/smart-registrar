import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  DOCUMENT_TYPE_PAGE_SIZE,
  staffDocumentTypesHref,
  type StaffDocumentTypeFilters,
} from "@/lib/registrar/document-type-filters";
import { cn } from "@/lib/utils";

type DocumentTypePaginationProps = {
  filters: StaffDocumentTypeFilters;
  total: number;
  pageCount: number;
};

export function DocumentTypePagination({
  filters,
  total,
  pageCount,
}: DocumentTypePaginationProps) {
  if (total <= DOCUMENT_TYPE_PAGE_SIZE) {
    return (
      <p className="text-sm text-muted-foreground">
        {total === 1 ? "1 document type" : `${total} document types`}
      </p>
    );
  }

  const from = (filters.page - 1) * DOCUMENT_TYPE_PAGE_SIZE + 1;
  const to = Math.min(filters.page * DOCUMENT_TYPE_PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {from}–{to} of {total} document types
      </p>
      <div className="flex gap-2">
        <Link
          href={staffDocumentTypesHref({
            ...filters,
            page: Math.max(1, filters.page - 1),
          })}
          aria-disabled={filters.page <= 1}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            filters.page <= 1 && "pointer-events-none opacity-50"
          )}
        >
          Previous
        </Link>
        <Link
          href={staffDocumentTypesHref({
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
