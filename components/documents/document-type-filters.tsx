import Link from "next/link";

import { ChipRow } from "@/components/shared/chip-row";
import { SEARCH_FORM_CLASS } from "@/components/shared/search-form";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  staffDocumentTypesHref,
  type StaffDocumentTypeFilters,
} from "@/lib/registrar/document-type-filters";
import {
  DOCUMENT_TYPE_ACTIVITY_FILTERS,
  DOCUMENT_TYPE_ACTIVITY_LABELS,
} from "@/lib/registrar/document-type-types";
import { cn } from "@/lib/utils";

type DocumentTypeFiltersProps = {
  filters: StaffDocumentTypeFilters;
};

export function DocumentTypeFilters({ filters }: DocumentTypeFiltersProps) {
  return (
    <div className="space-y-4">
      <form
        action="/registrar/documents"
        method="get"
        className={SEARCH_FORM_CLASS}
      >
        {filters.activity !== "all" ? (
          <input type="hidden" name="activity" value={filters.activity} />
        ) : null}
        <div className="space-y-1.5">
          <Label htmlFor="document-type-search">Search</Label>
          <Input
            id="document-type-search"
            name="q"
            defaultValue={filters.q}
            placeholder="Name or description"
          />
        </div>
        <button type="submit" className={cn(buttonVariants({ variant: "outline" }))}>
          Search
        </button>
        {filters.q ? (
          <a
            href={staffDocumentTypesHref({ activity: filters.activity })}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Clear
          </a>
        ) : null}
      </form>

      <ChipRow label="Document type status">
        {DOCUMENT_TYPE_ACTIVITY_FILTERS.map((activity) => (
          <Link
            key={activity}
            href={staffDocumentTypesHref({ ...filters, activity, page: 1 })}
            className={cn(
              buttonVariants({
                variant: filters.activity === activity ? "default" : "outline",
                size: "sm",
              })
            )}
          >
            {DOCUMENT_TYPE_ACTIVITY_LABELS[activity]}
          </Link>
        ))}
      </ChipRow>
    </div>
  );
}
