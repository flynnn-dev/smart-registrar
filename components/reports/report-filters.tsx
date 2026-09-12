import Link from "next/link";

import { ChipRow } from "@/components/shared/chip-row";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { schoolCalendarDate } from "@/lib/format/datetime";
import { staffReportsHref } from "@/lib/registrar/report-filters";
import {
  REPORT_PERIOD_LABELS,
  REPORT_PERIODS,
  type StaffReportFilters,
} from "@/lib/registrar/report-types";
import { cn } from "@/lib/utils";

type ReportFiltersProps = {
  filters: StaffReportFilters;
};

export function ReportFilters({ filters }: ReportFiltersProps) {
  const today = schoolCalendarDate();

  return (
    <div className="space-y-4 print:hidden">
      <ChipRow label="Report period">
        {REPORT_PERIODS.map((period) => (
          <Link
            key={period}
            href={staffReportsHref(
              period === "custom"
                ? { period, from: filters.from, to: filters.to }
                : { period }
            )}
            className={cn(
              buttonVariants({
                variant: filters.period === period ? "default" : "outline",
                size: "sm",
              })
            )}
          >
            {REPORT_PERIOD_LABELS[period]}
          </Link>
        ))}
      </ChipRow>

      {filters.period === "custom" ? (
        <form
          action="/registrar/reports"
          method="get"
          className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
        >
          <input type="hidden" name="period" value="custom" />
          <div className="space-y-1.5">
            <Label htmlFor="report-from">From</Label>
            <Input
              id="report-from"
              type="date"
              name="from"
              defaultValue={filters.from}
              max={today}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="report-to">To</Label>
            <Input
              id="report-to"
              type="date"
              name="to"
              defaultValue={filters.to}
              max={today}
              required
            />
          </div>
          <button
            type="submit"
            className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
          >
            Apply
          </button>
        </form>
      ) : null}
    </div>
  );
}
