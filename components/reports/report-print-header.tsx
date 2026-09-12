import { APP_CONTACT_OFFICE, APP_NAME, APP_SCHOOL_NAME } from "@/lib/brand";
import { formatDateTime } from "@/lib/format/datetime";
import {
  REPORT_PERIOD_LABELS,
  type StaffReportData,
  type StaffReportFilters,
} from "@/lib/registrar/report-types";

type ReportPrintHeaderProps = {
  filters: StaffReportFilters;
  report: StaffReportData;
};

export function ReportPrintHeader({ filters, report }: ReportPrintHeaderProps) {
  return (
    <header className="mb-8 hidden border-b pb-6 print:block">
      <p className="text-caption uppercase tracking-[0.16em]">
        {APP_SCHOOL_NAME}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        Request Activity Report
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {APP_NAME} · {APP_CONTACT_OFFICE}
      </p>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-caption">Period</dt>
          <dd className="mt-0.5 font-medium">{REPORT_PERIOD_LABELS[filters.period]}</dd>
        </div>
        <div>
          <dt className="text-caption">Date range</dt>
          <dd className="mt-0.5 font-medium">{report.rangeLabel}</dd>
        </div>
        <div>
          <dt className="text-caption">Generated</dt>
          <dd className="mt-0.5 font-medium">{formatDateTime(report.generatedAt)}</dd>
        </div>
      </dl>
    </header>
  );
}
