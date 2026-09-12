import type { Metadata } from "next";

import { PrintReportButton } from "@/components/reports/print-report-button";
import { ReportCharts } from "@/components/reports/report-charts";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportPrintHeader } from "@/components/reports/report-print-header";
import { ReportSummary } from "@/components/reports/report-summary";
import { ReportTables } from "@/components/reports/report-tables";
import { PageHeader } from "@/components/shared/page-header";
import { requireStaffContext } from "@/lib/auth/session";
import { parseStaffReportFilters } from "@/lib/registrar/report-filters";
import { getStaffReportData } from "@/lib/registrar/reports";

export const metadata: Metadata = {
  title: "Reports",
};

export const dynamic = "force-dynamic";

type RegistrarReportsPageProps = {
  searchParams: Promise<{
    period?: string;
    from?: string;
    to?: string;
  }>;
};

export default async function RegistrarReportsPage({
  searchParams,
}: RegistrarReportsPageProps) {
  await requireStaffContext();
  const filters = parseStaffReportFilters(await searchParams);
  const report = await getStaffReportData(filters);

  return (
    <div className="space-y-8">
      <div className="print:hidden">
        <PageHeader
          title="Reports"
          description={`Request activity for ${report.rangeLabel}. Counts use live registrar records.`}
          actions={<PrintReportButton />}
        />
      </div>

      <ReportPrintHeader filters={filters} report={report} />
      <ReportFilters filters={filters} />
      <ReportSummary report={report} />
      <ReportCharts report={report} />
      <ReportTables report={report} />
    </div>
  );
}
