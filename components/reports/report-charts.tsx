"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import type { StaffReportData } from "@/lib/registrar/report-types";

type ReportChartsProps = {
  report: StaffReportData;
};

function ChartFrame({
  title,
  description,
  children,
  empty,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  empty?: string;
}) {
  return (
    <figure className="rounded-xl border bg-card p-5">
      <figcaption>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </figcaption>
      {empty ? (
        <p className="mt-10 mb-6 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <div className="mt-4 h-64 w-full">{children}</div>
      )}
    </figure>
  );
}

export function ReportCharts({ report }: ReportChartsProps) {
  const hasVolume = report.volume.some((point) => point.count > 0);

  return (
    <div className="space-y-4 print:hidden">
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartFrame
          title={
            report.volumeKind === "monthly"
              ? "Monthly requests"
              : "Daily requests"
          }
          description={
            report.volumeKind === "monthly"
              ? `Requests submitted by month · ${report.rangeLabel}`
              : `Requests submitted by day · ${report.rangeLabel}`
          }
          empty={hasVolume ? undefined : "No requests were submitted in this range."}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={report.volume} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                width={28}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                content={<ChartTooltip />}
              />
              <Bar
                dataKey="count"
                name="Requests"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>

        <ChartFrame
          title="Requests by status"
          description="Current status of requests submitted in this range."
          empty={
            report.statusDistribution.length === 0
              ? "No request statuses to show yet."
              : undefined
          }
        >
          <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-center">
            <div className="h-48 min-w-0 flex-1 sm:h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={report.statusDistribution}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    stroke="var(--card)"
                  >
                    {report.statusDistribution.map((slice) => (
                      <Cell key={slice.status} fill={slice.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="grid gap-2 text-sm sm:w-44">
              {report.statusDistribution.map((slice) => (
                <li key={slice.status} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: slice.color }}
                    />
                    <span className="truncate">{slice.label}</span>
                  </span>
                  <span className="font-medium tabular-nums">{slice.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </ChartFrame>
      </div>

      <ChartFrame
        title="Requests by document type"
        description={`Most requested documents · ${report.rangeLabel}`}
        empty={
          report.documentTypes.length === 0
            ? "No document types have been requested in this range."
            : undefined
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={report.documentTypes}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={148}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              content={<ChartTooltip />}
            />
            <Bar
              dataKey="count"
              name="Requests"
              fill="var(--chart-2)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
  );
}
