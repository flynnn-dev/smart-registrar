import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, ClipboardList } from "lucide-react";

import { RequestTable } from "@/components/requests/request-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { AccountStatusBadge } from "@/components/students/account-status-badge";
import { Button } from "@/components/ui/button";
import { requireStaffContext } from "@/lib/auth/session";
import { REQUEST_ID_PATTERN } from "@/lib/requests/types";
import { getStaffStudentDetail } from "@/lib/registrar/students";
import { isActiveRequestStatus } from "@/lib/status";

export const dynamic = "force-dynamic";

type RegistrarStudentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: RegistrarStudentDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  if (!REQUEST_ID_PATTERN.test(id)) {
    return { title: "Student" };
  }

  await requireStaffContext();
  const student = await getStaffStudentDetail(id);

  return {
    title: student ? student.name : "Student",
  };
}

export default async function RegistrarStudentDetailPage({
  params,
}: RegistrarStudentDetailPageProps) {
  const { id } = await params;
  await requireStaffContext();

  if (!REQUEST_ID_PATTERN.test(id)) {
    notFound();
  }

  const student = await getStaffStudentDetail(id);

  if (!student) {
    notFound();
  }

  const activeCount = student.requests.filter((request) =>
    isActiveRequestStatus(request.status)
  ).length;
  const completedCount = student.requests.filter(
    (request) => request.status === "completed"
  ).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title={student.name}
        description={student.campusId ?? "Campus student ID not set"}
        actions={
          <Button asChild variant="outline">
            <Link href="/registrar/students">All students</Link>
          </Button>
        }
      />

      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-8">
          <div>
            <p className="text-caption uppercase tracking-[0.16em]">Student</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {student.name}
            </p>
          </div>
          <AccountStatusBadge status={student.accountStatus} />
        </div>

        <dl className="grid gap-4 px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <dt className="text-caption">Student ID</dt>
            <dd className="mt-1 font-mono text-sm font-medium">
              {student.campusId ?? "Not set"}
            </dd>
          </div>
          <div>
            <dt className="text-caption">Email</dt>
            <dd className="mt-1 text-sm font-medium">{student.email}</dd>
          </div>
          <div>
            <dt className="text-caption">Contact</dt>
            <dd className="mt-1 text-sm font-medium">
              {student.phone || "Not set"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total requests", value: student.requestCount },
          { label: "Active", value: activeCount },
          { label: "Completed", value: completedCount },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border bg-card px-4 py-4">
            <p className="text-caption">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-section">Request history</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Open a request to review details or update its status.
          </p>
        </div>
        {student.requests.length === 0 ? (
          <div className="rounded-xl border bg-card">
            <EmptyState
              icon={ClipboardList}
              title="No requests yet"
              description="This student has not submitted a document request."
            />
          </div>
        ) : (
          <RequestTable requests={student.requests} hideStudent />
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-section">Upcoming appointments</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Scheduled and checked-in visits from today onward.
          </p>
        </div>
        {student.upcomingAppointments.length === 0 ? (
          <div className="rounded-xl border bg-card">
            <EmptyState
              icon={CalendarClock}
              title="No upcoming appointments"
              description="There is no scheduled visit for this student right now."
            />
          </div>
        ) : (
          <ul className="space-y-3">
            {student.upcomingAppointments.map((appointment) => (
              <li
                key={appointment.id}
                className="flex flex-col gap-3 rounded-xl border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{appointment.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {appointment.documentName ?? "Registrar appointment"}
                    {appointment.requestNumber
                      ? ` · ${appointment.requestNumber}`
                      : ""}
                  </p>
                </div>
                <StatusBadge kind="appointment" status={appointment.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
