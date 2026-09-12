"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  documentTypeSchema,
  type DocumentTypeValues,
} from "@/lib/registrar/document-type-schema";
import type { StaffDocumentType } from "@/lib/registrar/document-type-types";

type DocumentTypeDialogProps = {
  open: boolean;
  documentType: StaffDocumentType | null;
  pending?: boolean;
  onClose: () => void;
  onSubmit: (values: DocumentTypeValues) => Promise<string | null>;
};

function DocumentTypeForm({
  documentType,
  pending,
  onClose,
  onSubmit,
}: Omit<DocumentTypeDialogProps, "open">) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DocumentTypeValues>({
    resolver: zodResolver(documentTypeSchema),
    defaultValues: {
      name: documentType?.name ?? "",
      description: documentType?.description ?? "",
      processingDays: documentType?.processingDays ?? 3,
      isActive: documentType?.isActive ?? true,
    },
  });

  const busy = pending || isSubmitting;

  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={handleSubmit(async (values) => {
        setFormError(null);
        const error = await onSubmit(values);
        if (error) {
          setFormError(error);
        }
      })}
      noValidate
    >
      {formError ? (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <FormField label="Name" htmlFor="document-type-name" error={errors.name?.message}>
        <Input
          id="document-type-name"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="document-type-description"
        error={errors.description?.message}
        hint="Shown on the public services list and student request form."
      >
        <Textarea
          id="document-type-description"
          rows={3}
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />
      </FormField>

      <FormField
        label="Processing days"
        htmlFor="document-type-days"
        error={errors.processingDays?.message}
        hint="Estimated business days after review."
      >
        <Input
          id="document-type-days"
          type="number"
          min={0}
          max={60}
          aria-invalid={Boolean(errors.processingDays)}
          {...register("processingDays", { valueAsNumber: true })}
        />
      </FormField>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-5 rounded border-input md:size-4"
          {...register("isActive")}
        />
        Available to students
      </label>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onClose}
          disabled={busy}
        >
          Go back
        </Button>
        <Button type="submit" className="w-full sm:w-auto" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : null}
          {documentType ? "Save changes" : "Add document type"}
        </Button>
      </div>
    </form>
  );
}

export function DocumentTypeDialog({
  open,
  documentType,
  pending = false,
  onClose,
  onSubmit,
}: DocumentTypeDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, pending, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center"
      role="presentation"
      onClick={() => {
        if (!pending) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-type-dialog-title"
        className="max-h-[min(40rem,calc(100dvh-2rem))] w-full max-w-lg overflow-y-auto rounded-xl border bg-card p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="document-type-dialog-title" className="text-section">
          {documentType ? "Edit document type" : "Add document type"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Students only see active document types on the request form and
          public services list.
        </p>
        <DocumentTypeForm
          key={documentType?.id ?? "new"}
          documentType={documentType}
          pending={pending}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
