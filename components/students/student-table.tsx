import Link from "next/link";

import { AccountStatusBadge } from "@/components/students/account-status-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import type { StaffStudentSummary } from "@/lib/registrar/student-types";
import { cn } from "@/lib/utils";

type StudentTableProps = {
  students: StaffStudentSummary[];
};

export function StudentTable({ students }: StudentTableProps) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {students.map((student) => (
          <Link
            key={student.id}
            href={`/registrar/students/${student.id}`}
            className="surface-card hover-lift block p-4 motion-safe:transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <article className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{student.name}</p>
                  {student.campusId ? (
                    <p className="font-mono text-caption">{student.campusId}</p>
                  ) : null}
                </div>
                <AccountStatusBadge status={student.accountStatus} />
              </div>
              <p className="text-sm text-muted-foreground">{student.email}</p>
              <p className="text-caption">{student.phone || "No contact number"}</p>
              <p className="text-caption">
                {student.requestCount === 1
                  ? "1 request"
                  : `${student.requestCount} requests`}
                {student.latestRequest
                  ? ` · ${student.latestRequest.requestNumber}`
                  : ""}
              </p>
            </article>
          </Link>
        ))}
      </div>

      <div className="surface-card hidden overflow-x-auto md:block">
        <table className="w-full min-w-5xl text-sm">
          <thead className="border-b bg-muted/40 text-left text-caption">
            <tr>
              <th className="px-4 py-3 font-medium">Student ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Requests</th>
              <th className="px-4 py-3 font-medium">Latest request</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b last:border-0 motion-safe:transition-colors hover:bg-accent/40"
              >
                <td className="px-4 py-3 font-mono">
                  {student.campusId ?? "—"}
                </td>
                <td className="px-4 py-3 font-medium">{student.name}</td>
                <td className="px-4 py-3">{student.email}</td>
                <td className="px-4 py-3">{student.phone || "—"}</td>
                <td className="px-4 py-3">{student.requestCount}</td>
                <td className="px-4 py-3">
                  {student.latestRequest ? (
                    <div>
                      <p className="font-mono">{student.latestRequest.requestNumber}</p>
                      <p className="text-caption">
                        {student.latestRequest.documentName}
                      </p>
                      <StatusBadge
                        kind="request"
                        status={student.latestRequest.status}
                        className="mt-1"
                      />
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <AccountStatusBadge status={student.accountStatus} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/registrar/students/${student.id}`}
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
