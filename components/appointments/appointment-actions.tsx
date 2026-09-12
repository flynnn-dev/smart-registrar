"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  cancelStudentAppointment,
  updateStaffAppointmentStatus,
} from "@/lib/appointments/actions";
import { APPOINTMENT_STATUS_LABELS, type AppointmentStatus } from "@/lib/status";
import type { AppointmentRecord } from "@/lib/appointments/types";

type AppointmentActionsProps = {
  appointment: AppointmentRecord;
  actor: "student" | "staff";
};

type PendingAction = {
  status: AppointmentStatus;
  title: string;
  description: string;
  confirmLabel: string;
};

function staffChoices(status: AppointmentStatus): Array<{
  status: AppointmentStatus;
  label: string;
  confirm?: PendingAction;
}> {
  if (status === "scheduled") {
    return [
      { status: "checked_in", label: "Check in" },
      {
        status: "missed",
        label: "Mark missed",
        confirm: {
          status: "missed",
          title: "Mark this appointment as missed?",
          description:
            "Use this when the student did not arrive for the reserved slot.",
          confirmLabel: "Mark missed",
        },
      },
      {
        status: "cancelled",
        label: "Cancel",
        confirm: {
          status: "cancelled",
          title: "Cancel this appointment?",
          description:
            "The slot will open again. The linked document request stays on file.",
          confirmLabel: "Cancel appointment",
        },
      },
    ];
  }

  if (status === "checked_in") {
    return [
      { status: "completed", label: "Complete" },
      {
        status: "cancelled",
        label: "Cancel",
        confirm: {
          status: "cancelled",
          title: "Cancel this appointment?",
          description:
            "The student is already checked in. Cancel only if the visit will not continue.",
          confirmLabel: "Cancel appointment",
        },
      },
    ];
  }

  return [];
}

export function AppointmentActions({
  appointment,
  actor,
}: AppointmentActionsProps) {
  const [pending, setPending] = useState(false);
  const [confirm, setConfirm] = useState<PendingAction | null>(null);

  async function applyStatus(status: AppointmentStatus) {
    setPending(true);

    const result =
      actor === "student"
        ? await cancelStudentAppointment(appointment.id)
        : await updateStaffAppointmentStatus(appointment.id, status);

    setPending(false);
    setConfirm(null);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success(
      actor === "student"
        ? "Appointment cancelled"
        : `Appointment marked ${APPOINTMENT_STATUS_LABELS[status].toLowerCase()}`
    );
  }

  if (actor === "student") {
    if (appointment.status !== "scheduled") {
      return null;
    }

    return (
      <>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11 w-full sm:min-h-8 sm:w-auto"
          disabled={pending}
          onClick={() =>
            setConfirm({
              status: "cancelled",
              title: "Cancel this appointment?",
              description:
                "This slot will be released. Submit a new request if you still need a visit.",
              confirmLabel: "Cancel appointment",
            })
          }
        >
          Cancel
        </Button>
        <ConfirmDialog
          open={Boolean(confirm)}
          title={confirm?.title ?? ""}
          description={confirm?.description ?? ""}
          confirmLabel={confirm?.confirmLabel ?? "Confirm"}
          pending={pending}
          destructive
          onClose={() => {
            if (!pending) {
              setConfirm(null);
            }
          }}
          onConfirm={() => {
            void applyStatus("cancelled");
          }}
        />
      </>
    );
  }

  const choices = staffChoices(appointment.status);

  if (choices.length === 0) {
    return null;
  }

  return (
    <>
      {choices.map((choice) => (
        <Button
          key={choice.status}
          type="button"
          size="sm"
          variant={choice.status === "cancelled" || choice.status === "missed" ? "outline" : "default"}
          disabled={pending}
          onClick={() => {
            if (choice.confirm) {
              setConfirm(choice.confirm);
              return;
            }

            void applyStatus(choice.status);
          }}
        >
          {choice.label}
        </Button>
      ))}
      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title ?? ""}
        description={confirm?.description ?? ""}
        confirmLabel={confirm?.confirmLabel ?? "Confirm"}
        pending={pending}
        destructive
        onClose={() => {
          if (!pending) {
            setConfirm(null);
          }
        }}
        onConfirm={() => {
          if (confirm) {
            void applyStatus(confirm.status);
          }
        }}
      />
    </>
  );
}
