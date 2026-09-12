"use client";

import Link from "next/link";

import { ChipRow } from "@/components/shared/chip-row";
import { SEARCH_FORM_CLASS } from "@/components/shared/search-form";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  REQUEST_DATE_FILTERS,
  REQUEST_DATE_FILTER_LABELS,
  REQUEST_SORT_LABELS,
  REQUEST_SORTS,
  staffRequestsHref,
  type StaffRequestFilters,
} from "@/lib/registrar/request-filters";
import { REQUEST_STATUS_LABELS, REQUEST_STATUSES } from "@/lib/status";
import { cn } from "@/lib/utils";

type RequestFiltersProps = {
  filters: StaffRequestFilters;
  documentTypes: Array<{ id: string; name: string }>;
};

const selectClassName =
  "h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:h-8 md:text-sm";

export function RequestFilters({
  filters,
  documentTypes,
}: RequestFiltersProps) {
  return (
    <div className="space-y-4">
      <form
        action="/registrar/requests"
        method="get"
        className={SEARCH_FORM_CLASS}
      >
        {filters.status !== "all" ? (
          <input type="hidden" name="status" value={filters.status} />
        ) : null}
        {filters.documentTypeId ? (
          <input type="hidden" name="document" value={filters.documentTypeId} />
        ) : null}
        {filters.date !== "all" ? (
          <input type="hidden" name="date" value={filters.date} />
        ) : null}
        {filters.sort !== "submitted" ? (
          <input type="hidden" name="sort" value={filters.sort} />
        ) : null}
        <div className="space-y-1.5">
          <Label htmlFor="request-search">Search</Label>
          <Input
            id="request-search"
            name="q"
            defaultValue={filters.q}
            placeholder="Request number, student, or student ID"
          />
        </div>
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Search
        </button>
      </form>

      <ChipRow label="Request status">
        {(["all", ...REQUEST_STATUSES] as const).map((status) => (
          <Link
            key={status}
            href={staffRequestsHref({ ...filters, status, page: 1 })}
            className={cn(
              buttonVariants({
                variant: filters.status === status ? "default" : "outline",
                size: "sm",
              })
            )}
          >
            {status === "all" ? "All statuses" : REQUEST_STATUS_LABELS[status]}
          </Link>
        ))}
      </ChipRow>

      <ChipRow label="Submitted date">
        {REQUEST_DATE_FILTERS.map((date) => (
          <Link
            key={date}
            href={staffRequestsHref({ ...filters, date, page: 1 })}
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

      <div className="grid gap-3 sm:grid-cols-2 sm:flex sm:flex-wrap">
        <div className="min-w-0 space-y-1.5 sm:w-auto">
          <Label htmlFor="request-document">Document</Label>
          <select
            id="request-document"
            className={selectClassName}
            defaultValue={filters.documentTypeId}
            onChange={(event) => {
              window.location.href = staffRequestsHref({
                ...filters,
                documentTypeId: event.target.value,
                page: 1,
              });
            }}
          >
            <option value="">All documents</option>
            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0 space-y-1.5 sm:w-auto">
          <Label htmlFor="request-sort">Sort</Label>
          <select
            id="request-sort"
            className={selectClassName}
            defaultValue={filters.sort}
            onChange={(event) => {
              window.location.href = staffRequestsHref({
                ...filters,
                sort: event.target.value as StaffRequestFilters["sort"],
                page: 1,
              });
            }}
          >
            {REQUEST_SORTS.map((sort) => (
              <option key={sort} value={sort}>
                {REQUEST_SORT_LABELS[sort]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
