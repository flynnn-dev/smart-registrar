import { ClipboardList } from "lucide-react";
import Link from "next/link";

import { RequestTimeline } from "@/components/dashboard/request-timeline";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import type { FeaturedRequest } from "@/lib/student/dashboard";

type ActiveRequestPanelProps = {
  request: FeaturedRequest | null;
};

export function ActiveRequestPanel({ request }: ActiveRequestPanelProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-section">Active Request</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The request that needs your attention right now.
        </p>
      </div>

      {request ? (
        <div className="space-y-5 rounded-xl border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-caption">Request number</p>
              <p className="mt-1 text-base font-semibold tracking-tight">
                {request.requestNumber}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {request.documentName}
              </p>
            </div>
            <StatusBadge kind="request" status={request.status} />
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-caption">Appointment</dt>
              <dd className="mt-1 text-sm font-medium">
                {request.appointmentLabel ?? "No appointment scheduled"}
              </dd>
            </div>
            <div>
              <dt className="text-caption">Last updated</dt>
              <dd className="mt-1 text-sm font-medium">{request.updatedLabel}</dd>
            </div>
          </dl>

          <RequestTimeline status={request.status} />

          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
            <Button className="w-full sm:w-auto" asChild>
              <Link href={`/student/requests/${request.id}`}>View request</Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/student/requests/new">New request</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <EmptyState
            icon={ClipboardList}
            title="No active requests"
            description="You haven't submitted a document request yet."
            action={
              <Button asChild>
                <Link href="/student/requests/new">Start a request</Link>
              </Button>
            }
          />
        </div>
      )}
    </section>
  );
}
