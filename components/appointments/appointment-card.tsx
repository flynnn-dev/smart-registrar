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
    <article className="surface-card space-y-3 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
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
        <StatusBadge
          kind="appointment"
          status={appointment.status}
          className="self-start"
        />
      </div>
      {actions ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {actions}
        </div>
      ) : null}
    </article>
  );
}
