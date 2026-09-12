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
import type {
  DocumentTypePoint,
  StatusSlice,
  VolumePoint,
} from "@/lib/registrar/dashboard-types";

type RequestActivityChartsProps = {
  volume: VolumePoint[];
  statusDistribution: StatusSlice[];
  documentTypes: DocumentTypePoint[];
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

export function RequestActivityCharts({
  volume,
  statusDistribution,
  documentTypes,
}: RequestActivityChartsProps) {
  const hasVolume = volume.some((point) => point.count > 0);
  const typeRows = documentTypes;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartFrame
          title="Requests by day"
          description="Documents submitted in the last 7 days."
          empty={hasVolume ? undefined : "No requests were submitted this week."}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volume} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          title="Status distribution"
          description="Current request statuses across the office."
          empty={
            statusDistribution.length === 0
              ? "No request statuses to show yet."
              : undefined
          }
        >
          <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-center">
            <div className="h-48 min-w-0 flex-1 sm:h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    stroke="var(--card)"
                  >
                    {statusDistribution.map((slice) => (
                      <Cell key={slice.status} fill={slice.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="grid gap-2 text-sm sm:w-44">
              {statusDistribution.map((slice) => (
                <li key={slice.status} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 min-w-0">
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
        title="Popular document types"
        description="Requests submitted in the last 30 days."
        empty={
          documentTypes.length === 0
            ? "No document types have been requested yet."
            : undefined
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={typeRows}
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
