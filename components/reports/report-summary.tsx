import type { StaffReportData } from "@/lib/registrar/report-types";

type ReportSummaryProps = {
  report: StaffReportData;
};

export function ReportSummary({ report }: ReportSummaryProps) {
  const items = [
    {
      label: report.stats.dailyIsAverage ? "Daily average" : "Daily requests",
      value: report.stats.dailyRequests,
      hint: report.stats.dailyIsAverage
        ? "Submitted per day in this range"
        : "Submitted today",
    },
    {
      label: "Monthly requests",
      value: report.stats.monthlyRequests,
      hint: "Submitted this school month",
    },
    {
      label: "Completed requests",
      value: report.stats.completed,
      hint: "Now completed in this range",
    },
    {
      label: "Pending requests",
      value: report.stats.pending,
      hint: "Submitted or under review",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border bg-card px-4 py-4 print:break-inside-avoid">
          <p className="text-caption">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
            {item.value}
          </p>
          <p className="mt-1 text-caption">{item.hint}</p>
        </div>
      ))}
    </section>
  );
}
