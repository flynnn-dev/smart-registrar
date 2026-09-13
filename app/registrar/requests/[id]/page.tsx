import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RequestProgress } from "@/components/requests/request-progress";
import { RequestStatusActions } from "@/components/requests/request-status-actions";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { requireStaffContext } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/format/datetime";
import { REQUEST_ID_PATTERN } from "@/lib/requests/types";
import { getStaffRequestDetail } from "@/lib/registrar/requests";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/status";

export const dynamic = "force-dynamic";

type RegistrarRequestDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: RegistrarRequestDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  if (!REQUEST_ID_PATTERN.test(id)) {
    return { title: "Request" };
  }

  await requireStaffContext();
  const request = await getStaffRequestDetail(id);

  return {
    title: request ? request.requestNumber : "Request",
  };
}

export default async function RegistrarRequestDetailPage({
  params,
}: RegistrarRequestDetailPageProps) {
  const { id } = await params;
  await requireStaffContext();

  if (!REQUEST_ID_PATTERN.test(id)) {
    notFound();
  }

  const request = await getStaffRequestDetail(id);

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
            <Link href="/registrar/requests">All requests</Link>
          </Button>
        }
      />

      <section className="surface-card overflow-hidden">
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

        <div className="grid gap-8 px-5 py-6 sm:px-8 lg:grid-cols-2">
          <div>
            <h3 className="text-section">Student</h3>
            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-caption">Full name</dt>
                <dd className="mt-1 text-sm font-medium">
                  {request.studentUserId ? (
                    <Link
                      href={`/registrar/students/${request.studentUserId}`}
                      className="hover:underline"
                    >
                      {request.studentName}
                    </Link>
                  ) : (
                    request.studentName
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-caption">Student ID</dt>
                <dd className="mt-1 text-sm font-medium">
                  {request.studentCampusId ?? "Not set"}
                </dd>
              </div>
              <div>
                <dt className="text-caption">Email</dt>
                <dd className="mt-1 text-sm font-medium">
                  {request.studentEmail || "Not set"}
                </dd>
              </div>
              <div>
                <dt className="text-caption">Contact</dt>
                <dd className="mt-1 text-sm font-medium">
                  {request.studentPhone || "Not set"}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-section">Request</h3>
            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-caption">Document</dt>
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
            </dl>
          </div>
        </div>

        <dl className="grid gap-4 border-t px-5 py-6 sm:px-8">
          <div>
            <dt className="text-caption">Purpose</dt>
            <dd className="mt-1 text-sm leading-6">
              {request.purpose || "No purpose provided."}
            </dd>
          </div>
          <div>
            <dt className="text-caption">Remarks</dt>
            <dd className="mt-1 text-sm leading-6 text-muted-foreground">
              {request.remarks || "No remarks yet."}
            </dd>
          </div>
        </dl>
      </section>

      <section className="surface-card px-5 py-6 sm:px-8">
        <h3 className="text-section">Update status</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Only allowed transitions are shown. Each change is logged and the
          student is notified.
        </p>
        <div className="mt-4">
          <RequestStatusActions requestId={request.id} status={request.status} />
        </div>
      </section>

      <section className="surface-card px-5 py-6 sm:px-8">
        <h3 className="text-section">Status</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Completed steps keep their date and remarks from the history log.
        </p>
        <div className="mt-6">
          <RequestProgress steps={request.progress} />
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {request.studentUserId ? (
          <Button asChild variant="outline">
            <Link href={`/registrar/students/${request.studentUserId}`}>
              View student
            </Link>
          </Button>
        ) : null}
        {request.queueNumber ? (
          <Button asChild variant="outline">
            <Link
              href={
                request.queueDate
                  ? `/registrar/queue?date=${request.queueDate}`
                  : "/registrar/queue"
              }
            >
              View queue
            </Link>
          </Button>
        ) : null}
        {request.appointmentLabel ? (
          <Button asChild variant="outline">
            <Link href="/registrar/appointments">View appointments</Link>
          </Button>
        ) : null}
        <Button asChild variant="outline">
          <Link
            href={`/registrar/transactions?q=${encodeURIComponent(request.requestNumber)}`}
          >
            View transactions
          </Link>
        </Button>
      </div>
    </div>
  );
}
