import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import Link from "next/link";

import { AppointmentActions } from "@/components/appointments/appointment-actions";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { requireStudentContext } from "@/lib/auth/session";
import { getStudentAppointments } from "@/lib/student/appointments";

export const metadata: Metadata = {
  title: "Appointments",
};

export const dynamic = "force-dynamic";

export default async function StudentAppointmentsPage() {
  const { userId, profile } = await requireStudentContext();
  const lists = await getStudentAppointments(
    userId,
    profile.full_name?.trim() || profile.email
  );
  const empty = lists.upcoming.length === 0 && lists.past.length === 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Appointments"
        description="Review the registrar visits linked to your document requests."
        actions={
          <Button asChild>
            <Link href="/student/requests/new">New request</Link>
          </Button>
        }
      />

      {empty ? (
        <div className="rounded-xl border bg-card">
          <EmptyState
            icon={CalendarClock}
            title="No appointments yet"
            description="Reserve a slot when you submit a document request."
            action={
              <Button asChild>
                <Link href="/student/requests/new">Start a request</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <h3 className="text-section">Upcoming</h3>
            {lists.upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You have no upcoming registrar visits.
              </p>
            ) : (
              <div className="space-y-3">
                {lists.upcoming.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    actions={
                      <AppointmentActions
                        appointment={appointment}
                        actor="student"
                      />
                    }
                  />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-section">Past</h3>
            {lists.past.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Completed or cancelled visits will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {lists.past.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
