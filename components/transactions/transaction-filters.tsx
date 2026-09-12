import Link from "next/link";

import { ChipRow } from "@/components/shared/chip-row";
import { SEARCH_FORM_CLASS } from "@/components/shared/search-form";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  REQUEST_DATE_FILTERS,
  REQUEST_DATE_FILTER_LABELS,
} from "@/lib/registrar/request-filters";
import {
  staffTransactionsHref,
  type StaffTransactionFilters,
} from "@/lib/registrar/transaction-filters";
import {
  TRANSACTION_ACTION_LABELS,
  TRANSACTION_ACTIONS,
} from "@/lib/registrar/transaction-types";
import { cn } from "@/lib/utils";

type TransactionFiltersProps = {
  filters: StaffTransactionFilters;
};

export function TransactionFilters({ filters }: TransactionFiltersProps) {
  return (
    <div className="space-y-4">
      <form
        action="/registrar/transactions"
        method="get"
        className={SEARCH_FORM_CLASS}
      >
        {filters.action !== "all" ? (
          <input type="hidden" name="action" value={filters.action} />
        ) : null}
        {filters.date !== "all" ? (
          <input type="hidden" name="date" value={filters.date} />
        ) : null}
        <div className="space-y-1.5">
          <Label htmlFor="transaction-search">Search</Label>
          <Input
            id="transaction-search"
            name="q"
            defaultValue={filters.q}
            placeholder="Request number, student, or staff"
          />
        </div>
        <button type="submit" className={cn(buttonVariants({ variant: "outline" }))}>
          Search
        </button>
        {filters.q ? (
          <a
            href={staffTransactionsHref({
              action: filters.action,
              date: filters.date,
            })}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Clear
          </a>
        ) : null}
      </form>

      <ChipRow label="Transaction action">
        {(["all", ...TRANSACTION_ACTIONS] as const).map((action) => (
          <Link
            key={action}
            href={staffTransactionsHref({ ...filters, action, page: 1 })}
            className={cn(
              buttonVariants({
                variant: filters.action === action ? "default" : "outline",
                size: "sm",
              })
            )}
          >
            {action === "all" ? "All actions" : TRANSACTION_ACTION_LABELS[action]}
          </Link>
        ))}
      </ChipRow>

      <ChipRow label="Transaction date">
        {REQUEST_DATE_FILTERS.map((date) => (
          <Link
            key={date}
            href={staffTransactionsHref({ ...filters, date, page: 1 })}
            className={cn(
              buttonVariants({
                variant: filters.date === date ? "default" : "outline",
                size: "sm",
              })
            )}
          >
            {REQUEST_DATE_FILTER_LABELS[date]}
          </Link>
        ))}
      </ChipRow>
    </div>
  );
}
