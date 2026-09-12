import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  STUDENT_PAGE_SIZE,
  staffStudentsHref,
  type StaffStudentFilters,
} from "@/lib/registrar/student-filters";
import { cn } from "@/lib/utils";

type StudentPaginationProps = {
  filters: StaffStudentFilters;
  total: number;
  pageCount: number;
};

export function StudentPagination({
  filters,
  total,
  pageCount,
}: StudentPaginationProps) {
  if (total <= STUDENT_PAGE_SIZE) {
    return (
      <p className="text-sm text-muted-foreground">
        {total === 1 ? "1 student" : `${total} students`}
      </p>
    );
  }

  const from = (filters.page - 1) * STUDENT_PAGE_SIZE + 1;
  const to = Math.min(filters.page * STUDENT_PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {from}–{to} of {total} students
      </p>
      <div className="flex gap-2">
        <Link
          href={staffStudentsHref({
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
          href={staffStudentsHref({
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
