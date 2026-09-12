"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateStaffRequestStatus } from "@/lib/registrar/request-actions";
import {
  REQUEST_STATUS_LABELS,
  REQUEST_TRANSITIONS,
  requestStatusActionLabel,
  type RequestStatus,
} from "@/lib/status";

type RequestStatusActionsProps = {
  requestId: string;
  status: RequestStatus;
};

type PendingChange = {
  status: RequestStatus;
  title: string;
  description: string;
  confirmLabel: string;
  requireRemarks: boolean;
};

export function RequestStatusActions({
  requestId,
  status,
}: RequestStatusActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [confirm, setConfirm] = useState<PendingChange | null>(null);
  const [remarks, setRemarks] = useState("");
  const choices = REQUEST_TRANSITIONS[status];

  async function applyStatus(nextStatus: RequestStatus, note: string) {
    setPending(true);
    const result = await updateStaffRequestStatus(requestId, nextStatus, note);
    setPending(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    setConfirm(null);
    setRemarks("");
    toast.success(
      `Request marked ${REQUEST_STATUS_LABELS[nextStatus].toLowerCase()}`
    );
    router.refresh();
  }

  if (choices.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        This request has finished the registrar workflow.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {choices.map((nextStatus) => {
          const destructive = nextStatus === "rejected";

          return (
            <Button
              key={nextStatus}
              type="button"
              size="sm"
              variant={destructive ? "outline" : "default"}
              disabled={pending}
              onClick={() =>
                setConfirm({
                  status: nextStatus,
                  title: `${requestStatusActionLabel(status, nextStatus)}?`,
                  description: destructive
                    ? "The student will be asked to correct this request. Add a short note."
                    : `This will move the request to ${REQUEST_STATUS_LABELS[nextStatus].toLowerCase()} and notify the student.`,
                  confirmLabel: requestStatusActionLabel(status, nextStatus),
                  requireRemarks: destructive,
                })
              }
            >
              {requestStatusActionLabel(status, nextStatus)}
            </Button>
          );
        })}
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title ?? ""}
        description={confirm?.description ?? ""}
        confirmLabel={confirm?.confirmLabel ?? "Confirm"}
        pending={pending}
        destructive={confirm?.status === "rejected"}
        onClose={() => {
          if (!pending) {
            setConfirm(null);
            setRemarks("");
          }
        }}
        onConfirm={() => {
          if (!confirm) {
            return;
          }

          if (confirm.requireRemarks && remarks.trim().length === 0) {
            toast.error(
              "Add a short note so the student knows what to correct."
            );
            return;
          }

          void applyStatus(confirm.status, remarks);
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="request-status-remarks">
            Remarks
            {confirm?.requireRemarks ? " (required)" : " (optional)"}
          </Label>
          <Textarea
            id="request-status-remarks"
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            maxLength={500}
            placeholder={
              confirm?.requireRemarks
                ? "What does the student need to correct?"
                : "Optional note for the student and the history log"
            }
          />
        </div>
      </ConfirmDialog>
    </>
  );
}
