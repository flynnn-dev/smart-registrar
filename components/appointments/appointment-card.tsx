import { StatusBadge } from "@/components/shared/status-badge";
import { formatAppointmentSlot } from "@/lib/format/datetime";
import type { AppointmentRecord } from "@/lib/appointments/types";

type AppointmentCardProps = {
  appointment: AppointmentRecord;
  showStudent?: boolean;
  actions?: React.ReactNode;
};

export function AppointmentCard({
  appointment,
  showStudent = false,
  actions,
}: AppointmentCardProps) {
  return (
    <article className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            {formatAppointmentSlot(appointment.date, appointment.time)}
          </p>
          {showStudent ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {appointment.studentName}
              {appointment.studentId ? ` · ${appointment.studentId}` : ""}
            </p>
          ) : null}
          <p className="mt-1 text-sm text-muted-foreground">
            {appointment.documentName ?? "Registrar visit"}
            {appointment.requestNumber ? ` · ${appointment.requestNumber}` : ""}
          </p>
        </div>
        <StatusBadge kind="appointment" status={appointment.status} />
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </article>
  );
}
