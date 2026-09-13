import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { requireStudentContext } from "@/lib/auth/session";
import { getStudentRequestReceipt } from "@/lib/student/request";

export const metadata: Metadata = {
  title: "Request submitted",
};

export const dynamic = "force-dynamic";

const REQUEST_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type SuccessPageProps = {
  searchParams: Promise<{
    request?: string;
  }>;
};

export default async function StudentRequestSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { request } = await searchParams;
  const { userId } = await requireStudentContext();

  if (!request || !REQUEST_ID_PATTERN.test(request)) {
    notFound();
  }

  const receipt = await getStudentRequestReceipt(request, userId);

  if (!receipt) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Request submitted"
        description="The registrar has your request. Keep this number for follow-up."
      />

      <section className="surface-card overflow-hidden">
        <div className="bg-linear-to-b from-primary/8 to-transparent px-5 py-8 text-center sm:px-8">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-status-completed-bg text-status-completed">
            <CheckCircle2 className="size-6" aria-hidden />
          </span>
          <p className="mt-4 text-caption uppercase tracking-[0.16em]">
            Request number
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tracking-wide sm:text-3xl">
            {receipt.requestNumber}
          </p>
          <div className="mt-4 flex justify-center">
            <StatusBadge kind="request" status={receipt.status} />
          </div>
        </div>

        <dl className="grid gap-4 border-t px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <dt className="text-caption">Document</dt>
            <dd className="mt-1 text-sm font-medium">{receipt.documentName}</dd>
          </div>
          <div>
            <dt className="text-caption">Appointment</dt>
            <dd className="mt-1 text-sm font-medium">
              {receipt.appointmentLabel ?? "No appointment scheduled"}
            </dd>
          </div>
          {receipt.queueNumber ? (
            <div>
              <dt className="text-caption">Queue number</dt>
              <dd className="mt-1 font-mono text-sm font-medium">
                {receipt.queueNumber}
              </dd>
            </div>
          ) : null}
          {receipt.purpose ? (
            <div>
              <dt className="text-caption">Purpose</dt>
              <dd className="mt-1 text-sm leading-6">{receipt.purpose}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button asChild className="min-h-11 sm:min-h-8">
          <Link href={`/student/requests/${receipt.id}`}>View request</Link>
        </Button>
        <Button variant="outline" asChild className="min-h-11 sm:min-h-8">
          <Link href="/student/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
