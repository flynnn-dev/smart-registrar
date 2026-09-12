import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RequestProgress } from "@/components/requests/request-progress";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { requireStudentContext } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/format/datetime";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/status";
import { REQUEST_ID_PATTERN } from "@/lib/requests/types";
import { getStudentRequestDetail } from "@/lib/student/requests";

export const dynamic = "force-dynamic";

type StudentRequestDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: StudentRequestDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  if (!REQUEST_ID_PATTERN.test(id)) {
    return { title: "Request" };
  }

  const { userId } = await requireStudentContext();
  const request = await getStudentRequestDetail(id, userId);

  return {
    title: request ? request.requestNumber : "Request",
  };
}

export default async function StudentRequestDetailPage({
  params,
}: StudentRequestDetailPageProps) {
  const { id } = await params;
  const { userId } = await requireStudentContext();

  if (!REQUEST_ID_PATTERN.test(id)) {
    notFound();
  }

  const request = await getStudentRequestDetail(id, userId);

  if (!request) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={request.requestNumber}
        description={request.documentName}
        actions={
          <Button asChild variant="outline">
            <Link href="/student/requests">All requests</Link>
          </Button>
        }
      />

      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-8">
          <div>
            <p className="text-caption uppercase tracking-[0.16em]">
              Request number
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold tracking-tight">
              {request.requestNumber}
            </p>
          </div>
          <StatusBadge kind="request" status={request.status} />
        </div>

        <dl className="grid gap-4 px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <dt className="text-caption">Document type</dt>
            <dd className="mt-1 text-sm font-medium">{request.documentName}</dd>
          </div>
          <div>
            <dt className="text-caption">Submitted</dt>
            <dd className="mt-1 text-sm font-medium">
              {formatDateTime(request.submittedAt)}
            </dd>
          </div>
          <div>
            <dt className="text-caption">Appointment</dt>
            <dd className="mt-1 text-sm font-medium">
              {request.appointmentLabel ?? "No appointment scheduled"}
              {request.appointmentStatus ? (
                <span className="block text-caption">
                  {APPOINTMENT_STATUS_LABELS[request.appointmentStatus]}
                </span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt className="text-caption">Queue number</dt>
            <dd className="mt-1 font-mono text-sm font-medium">
              {request.queueNumber ?? "—"}
            </dd>
          </div>
          {request.purpose ? (
            <div className="sm:col-span-2">
              <dt className="text-caption">Purpose</dt>
              <dd className="mt-1 text-sm leading-6">{request.purpose}</dd>
            </div>
          ) : null}
          <div className="sm:col-span-2">
            <dt className="text-caption">Remarks</dt>
            <dd className="mt-1 text-sm leading-6 text-muted-foreground">
              {request.remarks || "No remarks yet."}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border bg-card px-5 py-6 sm:px-8">
        <h3 className="text-section">Status</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Each step is recorded when the registrar updates your request.
        </p>
        <div className="mt-6">
          <RequestProgress steps={request.progress} />
        </div>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {request.queueNumber ? (
          <Button asChild variant="outline" className="min-h-11 sm:min-h-8">
            <Link
              href={
                request.queueDate
                  ? `/student/queue?date=${request.queueDate}`
                  : "/student/queue"
              }
            >
              View queue
            </Link>
          </Button>
        ) : null}
        {request.appointmentLabel ? (
          <Button asChild variant="outline" className="min-h-11 sm:min-h-8">
            <Link href="/student/appointments">View appointment</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
