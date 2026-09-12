import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format/datetime";
import type { StaffRequestSummary } from "@/lib/registrar/requests";
import { cn } from "@/lib/utils";

type RequestTableProps = {
  requests: StaffRequestSummary[];
  hideStudent?: boolean;
};

function StudentCell({ request }: { request: StaffRequestSummary }) {
  const name = request.studentUserId ? (
    <Link
      href={`/registrar/students/${request.studentUserId}`}
      className="hover:underline"
    >
      {request.studentName}
    </Link>
  ) : (
    request.studentName
  );

  return (
    <div>
      <p>{name}</p>
      {request.studentCampusId ? (
        <p className="text-caption">{request.studentCampusId}</p>
      ) : null}
    </div>
  );
}

export function RequestTable({
  requests,
  hideStudent = false,
}: RequestTableProps) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {requests.map((request) => (
          <Link
            key={request.id}
            href={`/registrar/requests/${request.id}`}
            className="block rounded-xl border bg-card p-4 transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <article className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold">
                    {request.requestNumber}
                  </p>
                  {hideStudent ? null : (
                    <>
                      <p className="mt-1 text-sm">{request.studentName}</p>
                      {request.studentCampusId ? (
                        <p className="text-caption">{request.studentCampusId}</p>
                      ) : null}
                    </>
                  )}
                </div>
                <StatusBadge kind="request" status={request.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {request.documentName}
              </p>
              <p className="text-caption">
                {formatDateTime(request.submittedAt)}
                {request.appointmentLabel ? ` · ${request.appointmentLabel}` : ""}
              </p>
            </article>
          </Link>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border md:block">
        <table className="w-full min-w-[56rem] text-sm">
          <thead className="border-b bg-muted/40 text-left text-caption">
            <tr>
              <th className="px-4 py-3 font-medium">Request #</th>
              {hideStudent ? null : (
                <th className="px-4 py-3 font-medium">Student</th>
              )}
              <th className="px-4 py-3 font-medium">Document</th>
              <th className="px-4 py-3 font-medium">Appointment</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono font-medium">
                  {request.requestNumber}
                </td>
                {hideStudent ? null : (
                  <td className="px-4 py-3">
                    <StudentCell request={request} />
                  </td>
                )}
                <td className="px-4 py-3">{request.documentName}</td>
                <td className="px-4 py-3">
                  {request.appointmentLabel ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge kind="request" status={request.status} />
                </td>
                <td className="px-4 py-3">
                  {formatDateTime(request.submittedAt)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/registrar/requests/${request.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
