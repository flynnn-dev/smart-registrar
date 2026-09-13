import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";

import { AppointmentActions } from "@/components/appointments/appointment-actions";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { AppointmentFilters } from "@/components/appointments/appointment-filters";
import { AppointmentStatsRow } from "@/components/appointments/appointment-stats";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { getRegistrarAppointments } from "@/lib/registrar/appointments";
import { parseAppointmentFilter } from "@/lib/appointments/types";
import { formatAppointmentSlot } from "@/lib/format/datetime";
import { requireStaffContext } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Appointments",
};

export const dynamic = "force-dynamic";

type RegistrarAppointmentsPageProps = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

export default async function RegistrarAppointmentsPage({
  searchParams,
}: RegistrarAppointmentsPageProps) {
  await requireStaffContext();
  const { filter: rawFilter } = await searchParams;
  const filter = parseAppointmentFilter(rawFilter);
  const data = await getRegistrarAppointments(filter);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Appointments"
        description="Check students in and keep the registrar calendar current."
      />

      <AppointmentStatsRow stats={data.todayStats} />
      <AppointmentFilters current={filter} />

      {data.appointments.length === 0 ? (
        <div className="surface-card">
          <EmptyState
            icon={CalendarClock}
            title="No appointments in this view"
            description="Try another date or status filter."
          />
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {data.appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showStudent
                actions={
                  <AppointmentActions appointment={appointment} actor="staff" />
                }
              />
            ))}
          </div>

          <div className="surface-card hidden overflow-x-auto md:block">
            <table className="w-full min-w-[52rem] text-sm">
              <thead className="border-b bg-muted/40 text-left text-caption">
                <tr>
                  <th className="px-4 py-3 font-medium">Schedule</th>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Request</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b last:border-0 motion-safe:transition-colors hover:bg-accent/40"
                  >
                    <td className="px-4 py-3 font-medium">
                      {formatAppointmentSlot(appointment.date, appointment.time)}
                    </td>
                    <td className="px-4 py-3">
                      <p>{appointment.studentName}</p>
                      {appointment.studentId ? (
                        <p className="text-caption">{appointment.studentId}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <p>{appointment.documentName ?? "Registrar visit"}</p>
                      {appointment.requestNumber ? (
                        <p className="text-caption">{appointment.requestNumber}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        kind="appointment"
                        status={appointment.status}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <AppointmentActions
                          appointment={appointment}
                          actor="staff"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
