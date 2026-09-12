"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { DocumentTypeDialog } from "@/components/documents/document-type-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatProcessingDays } from "@/lib/format/datetime";
import {
  createStaffDocumentType,
  setStaffDocumentTypeActive,
  updateStaffDocumentType,
} from "@/lib/registrar/document-type-actions";
import type { DocumentTypeValues } from "@/lib/registrar/document-type-schema";
import type { StaffDocumentType } from "@/lib/registrar/document-type-types";
import { cn } from "@/lib/utils";

type DocumentTypeManagerProps = {
  documentTypes: StaffDocumentType[];
};

type ActivityConfirm = {
  documentType: StaffDocumentType;
  nextActive: boolean;
};

function ActivityBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-md border-0",
        isActive
          ? "bg-status-completed-bg text-status-completed"
          : "bg-muted text-muted-foreground"
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}

export function DocumentTypeManager({
  documentTypes,
}: DocumentTypeManagerProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StaffDocumentType | null>(null);
  const [confirm, setConfirm] = useState<ActivityConfirm | null>(null);
  const [pending, setPending] = useState(false);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(documentType: StaffDocumentType) {
    setEditing(documentType);
    setDialogOpen(true);
  }

  async function saveDocumentType(values: DocumentTypeValues) {
    const wasEdit = Boolean(editing);
    setPending(true);
    const result = editing
      ? await updateStaffDocumentType(editing.id, values)
      : await createStaffDocumentType(values);
    setPending(false);

    if ("error" in result) {
      return result.error;
    }

    setDialogOpen(false);
    setEditing(null);
    toast.success(wasEdit ? "Document type updated" : "Document type added");
    router.refresh();
    return null;
  }

  async function applyActivity() {
    if (!confirm) {
      return;
    }

    setPending(true);
    const result = await setStaffDocumentTypeActive(
      confirm.documentType.id,
      confirm.nextActive
    );
    setPending(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success(
      confirm.nextActive
        ? `${confirm.documentType.name} is now available to students`
        : `${confirm.documentType.name} is hidden from students`
    );
    setConfirm(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex sm:justify-end">
        <Button type="button" className="w-full sm:w-auto" onClick={openCreate}>
          Add document type
        </Button>
      </div>

      {documentTypes.length === 0 ? null : (
      <div className="space-y-3 md:hidden">
        {documentTypes.map((documentType) => (
          <article
            key={documentType.id}
            className="space-y-3 rounded-xl border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{documentType.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {documentType.description || "No description"}
                </p>
              </div>
              <ActivityBadge isActive={documentType.isActive} />
            </div>
            <p className="text-caption">
              {formatProcessingDays(documentType.processingDays)}
              {documentType.requestCount === 1
                ? " · 1 request"
                : ` · ${documentType.requestCount} requests`}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => openEdit(documentType)}
              >
                Edit
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  setConfirm({
                    documentType,
                    nextActive: !documentType.isActive,
                  })
                }
              >
                {documentType.isActive ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </article>
        ))}
      </div>
      )}

      {documentTypes.length === 0 ? null : (
      <div className="hidden overflow-x-auto rounded-xl border md:block">
        <table className="w-full min-w-5xl text-sm">
          <thead className="border-b bg-muted/40 text-left text-caption">
            <tr>
              <th className="px-4 py-3 font-medium">Document</th>
              <th className="px-4 py-3 font-medium">Processing time</th>
              <th className="px-4 py-3 font-medium">Requests</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documentTypes.map((documentType) => (
              <tr key={documentType.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{documentType.name}</p>
                  <p className="mt-1 max-w-md text-caption">
                    {documentType.description || "No description"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  {formatProcessingDays(documentType.processingDays)}
                </td>
                <td className="px-4 py-3">{documentType.requestCount}</td>
                <td className="px-4 py-3">
                  <ActivityBadge isActive={documentType.isActive} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(documentType)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setConfirm({
                          documentType,
                          nextActive: !documentType.isActive,
                        })
                      }
                    >
                      {documentType.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      <DocumentTypeDialog
        open={dialogOpen}
        documentType={editing}
        pending={pending}
        onClose={() => {
          if (!pending) {
            setDialogOpen(false);
            setEditing(null);
          }
        }}
        onSubmit={saveDocumentType}
      />

      <ConfirmDialog
        open={Boolean(confirm)}
        title={
          confirm?.nextActive
            ? `Activate ${confirm.documentType.name}?`
            : `Deactivate ${confirm?.documentType.name ?? "this document"}?`
        }
        description={
          confirm?.nextActive
            ? "Students will see this document on the request form and the public services list."
            : "Students will no longer see this document when starting a request. Existing requests stay on file."
        }
        confirmLabel={confirm?.nextActive ? "Activate" : "Deactivate"}
        pending={pending}
        onConfirm={() => {
          void applyActivity();
        }}
        onClose={() => {
          if (!pending) {
            setConfirm(null);
          }
        }}
      />
    </>
  );
}
