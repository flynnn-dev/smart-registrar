import { StatusBadge } from "@/components/shared/status-badge";
import { formatCalendarDate } from "@/lib/format/datetime";
import type { QueueRecord } from "@/lib/queue/types";

type QueueCardProps = {
  ticket: QueueRecord;
  showStudent?: boolean;
  showDate?: boolean;
  actions?: React.ReactNode;
};

export function QueueCard({
  ticket,
  showStudent = false,
  showDate = false,
  actions,
}: QueueCardProps) {
  return (
    <article className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-lg font-semibold tracking-tight">
            {ticket.number}
          </p>
          {showDate ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCalendarDate(ticket.date)}
            </p>
          ) : null}
          {showStudent ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {ticket.studentName}
              {ticket.studentId ? ` · ${ticket.studentId}` : ""}
            </p>
          ) : null}
          <p className="mt-1 text-sm text-muted-foreground">
            {ticket.documentName ?? "Registrar request"}
            {ticket.requestNumber ? ` · ${ticket.requestNumber}` : ""}
          </p>
        </div>
        <StatusBadge kind="queue" status={ticket.status} />
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </article>
  );
}
