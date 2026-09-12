import type { Metadata } from "next";
import { Ticket } from "lucide-react";

import { NextUp } from "@/components/queue/next-up";
import { NowServing } from "@/components/queue/now-serving";
import { QueueActions } from "@/components/queue/queue-actions";
import { QueueCard } from "@/components/queue/queue-card";
import { QueueDateNav } from "@/components/queue/queue-date-nav";
import { QueueLiveSync } from "@/components/queue/queue-live-sync";
import { QueueStatsRow } from "@/components/queue/queue-stats";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { requireStaffContext } from "@/lib/auth/session";
import { formatCalendarDate, formatDateTime } from "@/lib/format/datetime";
import { getRegistrarQueue } from "@/lib/registrar/queue";

export const metadata: Metadata = {
  title: "Queue",
};

export const dynamic = "force-dynamic";

type RegistrarQueuePageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

export default async function RegistrarQueuePage({
  searchParams,
}: RegistrarQueuePageProps) {
  await requireStaffContext();
  const { date: rawDate } = await searchParams;
  const data = await getRegistrarQueue(rawDate);
  const serving = data.entries.find((entry) => entry.status === "serving") ?? null;
  const heading =
    data.date === data.today
      ? "Today's queue"
      : `${formatCalendarDate(data.date)} queue`;

  return (
    <div className="space-y-8">
      <QueueLiveSync date={data.date} />
      <PageHeader
        title="Queue"
        description="Call the next number and keep the registrar window moving."
      />

      <QueueDateNav
        href="/registrar/queue"
        dates={data.dates}
        current={data.date}
      />

      <div className="space-y-2">
        <h3 className="text-section">{heading}</h3>
        <NowServing number={data.board.servingNumber} />
      </div>

      <NextUp numbers={data.board.nextNumbers} />

      <div className="flex flex-wrap gap-2">
        <QueueActions
          mode="call-next"
          date={data.date}
          disabled={
            data.board.waitingCount === 0 || data.board.servingCount > 0
          }
        />
        {serving ? (
          <div className="flex flex-wrap gap-2">
            <QueueActions mode="entry" ticket={serving} />
          </div>
        ) : null}
      </div>

      <QueueStatsRow board={data.board} />

      {data.entries.length === 0 ? (
        <div className="rounded-xl border bg-card">
          <EmptyState
            icon={Ticket}
            title="No numbers for this day"
            description="Queue tickets appear when students submit document requests."
          />
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {data.entries.map((entry) => (
              <QueueCard
                key={entry.id}
                ticket={entry}
                showStudent
                actions={<QueueActions mode="entry" ticket={entry} />}
              />
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border md:block">
            <table className="w-full min-w-[56rem] text-sm">
              <thead className="border-b bg-muted/40 text-left text-caption">
                <tr>
                  <th className="px-4 py-3 font-medium">Number</th>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Request</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Called</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-mono font-semibold">
                      {entry.number}
                    </td>
                    <td className="px-4 py-3">
                      <p>{entry.studentName}</p>
                      {entry.studentId ? (
                        <p className="text-caption">{entry.studentId}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <p>{entry.documentName ?? "Registrar request"}</p>
                      {entry.requestNumber ? (
                        <p className="text-caption">{entry.requestNumber}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge kind="queue" status={entry.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {entry.calledAt ? formatDateTime(entry.calledAt) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <QueueActions mode="entry" ticket={entry} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
