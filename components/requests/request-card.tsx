import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/format/datetime";
import type { RequestSummary } from "@/lib/requests/types";

type RequestCardProps = {
  request: RequestSummary;
};

export function RequestCard({ request }: RequestCardProps) {
  return (
    <Link
      href={`/student/requests/${request.id}`}
      className="surface-card hover-lift block p-4 motion-safe:transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <article className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold tracking-tight">
            {request.requestNumber}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {request.documentName}
          </p>
          <p className="mt-1 text-caption">
            Submitted {formatDateTime(request.submittedAt)}
          </p>
          {request.appointmentLabel ? (
            <p className="text-caption">{request.appointmentLabel}</p>
          ) : null}
        </div>
        <StatusBadge
          kind="request"
          status={request.status}
          className="self-start"
        />
      </article>
    </Link>
  );
}
