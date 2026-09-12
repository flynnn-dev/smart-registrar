"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  callNextQueueEntry,
  updateStaffQueueStatus,
} from "@/lib/queue/actions";
import { QUEUE_STATUS_LABELS, type QueueStatus } from "@/lib/status";
import type { QueueRecord } from "@/lib/queue/types";

type QueueActionsProps =
  | {
      mode: "call-next";
      date: string;
      disabled?: boolean;
    }
  | {
      mode: "entry";
      ticket: QueueRecord;
    };

type PendingAction = {
  status: QueueStatus;
  title: string;
  description: string;
  confirmLabel: string;
};

function entryChoices(status: QueueStatus): Array<{
  status: QueueStatus;
  label: string;
  confirm?: PendingAction;
}> {
  if (status === "waiting") {
    return [
      { status: "serving", label: "Serve" },
      {
        status: "skipped",
        label: "Skip",
        confirm: {
          status: "skipped",
          title: "Skip this queue number?",
          description:
            "The student keeps the number. Staff can serve it again later.",
          confirmLabel: "Skip number",
        },
      },
      {
        status: "cancelled",
        label: "Cancel",
        confirm: {
          status: "cancelled",
          title: "Cancel this queue number?",
          description:
            "The number leaves today’s queue. The linked request stays on file.",
          confirmLabel: "Cancel number",
        },
      },
    ];
  }

  if (status === "serving") {
    return [
      { status: "completed", label: "Complete" },
      {
        status: "skipped",
        label: "Skip",
        confirm: {
          status: "skipped",
          title: "Skip this queue number?",
          description:
            "Use this when the student is not at the window. They can be served later.",
          confirmLabel: "Skip number",
        },
      },
      {
        status: "cancelled",
        label: "Cancel",
        confirm: {
          status: "cancelled",
          title: "Cancel this queue number?",
          description:
            "The student is already being served. Cancel only if the visit will not continue.",
          confirmLabel: "Cancel number",
        },
      },
    ];
  }

  if (status === "skipped") {
    return [
      { status: "serving", label: "Serve" },
      {
        status: "cancelled",
        label: "Cancel",
        confirm: {
          status: "cancelled",
          title: "Cancel this queue number?",
          description:
            "The number leaves today’s queue. The linked request stays on file.",
          confirmLabel: "Cancel number",
        },
      },
    ];
  }

  return [];
}

export function QueueActions(props: QueueActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [confirm, setConfirm] = useState<PendingAction | null>(null);

  async function applyStatus(status: QueueStatus, entryId: string) {
    setPending(true);
    const result = await updateStaffQueueStatus(entryId, status);
    setPending(false);
    setConfirm(null);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success(`Queue marked ${QUEUE_STATUS_LABELS[status].toLowerCase()}`);
    router.refresh();
  }

  async function callNext() {
    if (props.mode !== "call-next") {
      return;
    }

    setPending(true);
    const result = await callNextQueueEntry(props.date);
    setPending(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success(`Now serving ${result.number}`);
    router.refresh();
  }

  if (props.mode === "call-next") {
    return (
      <Button
        type="button"
        size="lg"
        disabled={pending || props.disabled}
        onClick={() => {
          void callNext();
        }}
      >
        Call next
      </Button>
    );
  }

  const choices = entryChoices(props.ticket.status);

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
          variant={
            choice.status === "cancelled" || choice.status === "skipped"
              ? "outline"
              : "default"
          }
          disabled={pending}
          onClick={() => {
            if (choice.confirm) {
              setConfirm(choice.confirm);
              return;
            }

            void applyStatus(choice.status, props.ticket.id);
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
            void applyStatus(confirm.status, props.ticket.id);
          }
        }}
      />
    </>
  );
}
