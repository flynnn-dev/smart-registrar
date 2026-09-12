import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  TRANSACTION_PAGE_SIZE,
  staffTransactionsHref,
  type StaffTransactionFilters,
} from "@/lib/registrar/transaction-filters";
import { cn } from "@/lib/utils";

type TransactionPaginationProps = {
  filters: StaffTransactionFilters;
  total: number;
  pageCount: number;
};

export function TransactionPagination({
  filters,
  total,
  pageCount,
}: TransactionPaginationProps) {
  if (total <= TRANSACTION_PAGE_SIZE) {
    return (
      <p className="text-sm text-muted-foreground">
        {total === 1 ? "1 transaction" : `${total} transactions`}
      </p>
    );
  }

  const from = (filters.page - 1) * TRANSACTION_PAGE_SIZE + 1;
  const to = Math.min(filters.page * TRANSACTION_PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {from}–{to} of {total} transactions
      </p>
      <div className="flex gap-2">
        <Link
          href={staffTransactionsHref({
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
          href={staffTransactionsHref({
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
