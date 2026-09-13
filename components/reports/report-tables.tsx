import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/format/datetime";
import type { StaffReportData } from "@/lib/registrar/report-types";

type ReportTablesProps = {
  report: StaffReportData;
};

export function ReportTables({ report }: ReportTablesProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card overflow-hidden print:break-inside-avoid">
          <div className="border-b px-4 py-3">
            <h3 className="text-section">Requests by document type</h3>
            <p className="mt-1 text-caption">{report.rangeLabel}</p>
          </div>
          {report.documentTypes.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              No document types in this range.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-caption">
                <tr>
                  <th className="px-4 py-2 font-medium">Document</th>
                  <th className="px-4 py-2 text-right font-medium">Requests</th>
                </tr>
              </thead>
              <tbody>
                {report.documentTypes.map((row) => (
                  <tr key={row.name} className="border-b last:border-0">
                    <td className="px-4 py-2">{row.name}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="surface-card overflow-hidden print:break-inside-avoid">
          <div className="border-b px-4 py-3">
            <h3 className="text-section">Requests by status</h3>
            <p className="mt-1 text-caption">{report.rangeLabel}</p>
          </div>
          {report.statusDistribution.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              No statuses in this range.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-caption">
                <tr>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 text-right font-medium">Requests</th>
                </tr>
              </thead>
              <tbody>
                {report.statusDistribution.map((row) => (
                  <tr key={row.status} className="border-b last:border-0">
                    <td className="px-4 py-2">{row.label}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="surface-card overflow-hidden print:break-inside-avoid">
        <div className="border-b px-4 py-3">
          <h3 className="text-section">Requests in this range</h3>
          <p className="mt-1 text-caption">
            {report.truncated
              ? `Showing ${report.requests.length} of ${report.total} requests`
              : report.total === 1
                ? "1 request"
                : `${report.total} requests`}
          </p>
        </div>

        {report.requests.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            No requests were submitted in this range.
          </p>
        ) : (
          <>
            <div className="space-y-3 p-4 md:hidden print:hidden">
              {report.requests.map((request) => (
                <article key={request.id} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/registrar/requests/${request.id}`}
                      className="font-mono text-sm hover:underline"
                    >
                      {request.requestNumber}
                    </Link>
                    <StatusBadge kind="request" status={request.status} />
                  </div>
                  <p className="text-sm">{request.documentName}</p>
                  {request.studentName ? (
                    request.studentUserId ? (
                      <Link
                        href={`/registrar/students/${request.studentUserId}`}
                        className="text-caption hover:underline"
                      >
                        {request.studentName}
                        {request.studentCampusId
                          ? ` · ${request.studentCampusId}`
                          : ""}
                      </Link>
                    ) : (
                      <p className="text-caption">{request.studentName}</p>
                    )
                  ) : null}
                  <p className="text-caption">{formatDateTime(request.submittedAt)}</p>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block print:block">
              <table className="w-full min-w-3xl text-sm">
                <thead className="border-b bg-muted/40 text-left text-caption">
                  <tr>
                    <th className="px-4 py-3 font-medium">Request</th>
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Document</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {report.requests.map((request) => (
                    <tr key={request.id} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <Link
                          href={`/registrar/requests/${request.id}`}
                          className="font-mono hover:underline"
                        >
                          {request.requestNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {request.studentName ? (
                          request.studentUserId ? (
                            <Link
                              href={`/registrar/students/${request.studentUserId}`}
                              className="hover:underline"
                            >
                              {request.studentName}
                            </Link>
                          ) : (
                            request.studentName
                          )
                        ) : (
                          "—"
                        )}
                        {request.studentCampusId ? (
                          <p className="text-caption">{request.studentCampusId}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">{request.documentName}</td>
                      <td className="px-4 py-3">
                        <StatusBadge kind="request" status={request.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatDateTime(request.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
