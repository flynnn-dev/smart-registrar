import type { Metadata } from "next";
import { Ticket } from "lucide-react";
import Link from "next/link";

import { NowServing } from "@/components/queue/now-serving";
import { QueueCard } from "@/components/queue/queue-card";
import { QueueDateNav } from "@/components/queue/queue-date-nav";
import { QueueLiveSync } from "@/components/queue/queue-live-sync";
import { StudentTicketPanel } from "@/components/queue/student-ticket-panel";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { requireStudentContext } from "@/lib/auth/session";
import { formatCalendarDate, schoolCalendarDate } from "@/lib/format/datetime";
import { getStudentQueue } from "@/lib/student/queue";

export const metadata: Metadata = {
  title: "Queue",
};

export const dynamic = "force-dynamic";

type StudentQueuePageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

export default async function StudentQueuePage({
  searchParams,
}: StudentQueuePageProps) {
  const { profile } = await requireStudentContext();
  const { date: rawDate } = await searchParams;
  const data = await getStudentQueue(
    profile.full_name?.trim() || profile.email,
    rawDate
  );
  const today = schoolCalendarDate();
  const heading =
    data.date === today
      ? "Today's queue"
      : `${formatCalendarDate(data.date)} queue`;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Queue"
        description="Watch the number being served and see how many people are ahead of you."
        actionsClassName="max-md:hidden"
        actions={
          <Button asChild>
            <Link href="/student/requests/new">New request</Link>
          </Button>
        }
      />

      {data.tickets.length === 0 ? (
        <div className="rounded-xl border bg-card">
          <EmptyState
            icon={Ticket}
            title="No queue number yet"
            description="You receive a queue number when you submit a document request."
            action={
              <Button asChild>
                <Link href="/student/requests/new">Start a request</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <QueueLiveSync date={data.date} />
          {data.dates.length > 1 ? (
            <QueueDateNav
              href="/student/queue"
              dates={data.dates}
              current={data.date}
            />
          ) : null}

          <div className="space-y-2">
            <h3 className="text-section">{heading}</h3>
            <NowServing number={data.board.servingNumber} />
          </div>

          <StudentTicketPanel board={data.board} />

          <section className="space-y-3">
            <h3 className="text-section">Your numbers</h3>
            {data.upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You have no open queue numbers.
              </p>
            ) : (
              <div className="space-y-3">
                {data.upcoming.map((ticket) => (
                  <QueueCard key={ticket.id} ticket={ticket} showDate />
                ))}
              </div>
            )}
          </section>

          {data.past.length > 0 ? (
            <section className="space-y-3">
              <h3 className="text-section">Past</h3>
              <div className="space-y-3">
                {data.past.map((ticket) => (
                  <QueueCard key={ticket.id} ticket={ticket} showDate />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
