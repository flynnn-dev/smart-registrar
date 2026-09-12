"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "@/components/auth/form-field";
import { AppointmentPicker } from "@/components/requests/appointment-picker";
import { DocumentTypeCards } from "@/components/requests/document-type-cards";
import { RequestStepper } from "@/components/requests/request-stepper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatAppointmentSlot } from "@/lib/format/datetime";
import { createStudentDocumentRequest } from "@/lib/student/request-actions";
import {
  documentRequestSchema,
  type DocumentRequestValues,
} from "@/lib/student/request-schema";
import type {
  AppointmentSlot,
  RequestDocumentType,
} from "@/lib/student/request";

type RequestWizardProps = {
  documentTypes: RequestDocumentType[];
  slots: AppointmentSlot[];
  studentName: string;
  studentId: string | null;
};

const STEP_FIELDS = {
  1: ["documentTypeId"],
  2: ["purpose", "remarks"],
  3: ["appointmentDate", "appointmentTime"],
} as const;

export function RequestWizard({
  documentTypes,
  slots,
  studentName,
  studentId,
}: RequestWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DocumentRequestValues>({
    resolver: zodResolver(documentRequestSchema),
    defaultValues: {
      documentTypeId: "",
      purpose: "",
      remarks: "",
      appointmentDate: "",
      appointmentTime: "",
    },
  });

  const values = useWatch({
    control,
    defaultValue: {
      documentTypeId: "",
      purpose: "",
      remarks: "",
      appointmentDate: "",
      appointmentTime: "",
    },
  });
  const selectedDocument = documentTypes.find(
    (documentType) => documentType.id === values.documentTypeId
  );

  async function goNext() {
    const fields = STEP_FIELDS[step as 1 | 2 | 3];
    const valid = await trigger(fields);

    if (valid) {
      setFormError(null);
      setStep((current) => current + 1);
    }
  }

  async function onSubmit(data: DocumentRequestValues) {
    setFormError(null);
    const result = await createStudentDocumentRequest(data);

    if ("error" in result) {
      setFormError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success("Request submitted");
    router.push(`/student/requests/new/success?request=${result.requestId}`);
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <RequestStepper currentStep={step} />

      {formError ? (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      {step === 1 ? (
        <section className="space-y-3">
          <div>
            <h3 className="text-section">Select a document</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose the registrar document you need.
            </p>
          </div>
          <DocumentTypeCards
            documentTypes={documentTypes}
            value={values.documentTypeId ?? ""}
            onChange={(id) =>
              setValue("documentTypeId", id, { shouldValidate: true })
            }
            error={errors.documentTypeId?.message}
          />
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-4">
          <div>
            <h3 className="text-section">Request details</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell the registrar why you need this document.
            </p>
          </div>
          <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2">
            <div>
              <p className="text-caption">Student</p>
              <p className="mt-1 text-sm font-medium">{studentName}</p>
            </div>
            <div>
              <p className="text-caption">Student ID</p>
              <p className="mt-1 text-sm font-medium">{studentId ?? "—"}</p>
            </div>
          </div>
          <FormField
            label="Purpose"
            htmlFor="purpose"
            error={errors.purpose?.message}
            hint="Example: scholarship renewal, employment, or transfer."
          >
            <Textarea
              id="purpose"
              rows={4}
              aria-invalid={Boolean(errors.purpose)}
              {...register("purpose")}
            />
          </FormField>
          <FormField
            label="Additional notes"
            htmlFor="remarks"
            error={errors.remarks?.message}
            hint="Optional. Copies needed or a preferred release note."
          >
            <Textarea
              id="remarks"
              rows={3}
              aria-invalid={Boolean(errors.remarks)}
              {...register("remarks")}
            />
          </FormField>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-3">
          <div>
            <h3 className="text-section">Choose a schedule</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Only open registrar slots are shown.
            </p>
          </div>
          <AppointmentPicker
            slots={slots}
            date={values.appointmentDate ?? ""}
            time={values.appointmentTime ?? ""}
            onDateChange={(date) => {
              setValue("appointmentDate", date, { shouldValidate: true });
              setValue("appointmentTime", "", { shouldValidate: false });
            }}
            onTimeChange={(time) =>
              setValue("appointmentTime", time, { shouldValidate: true })
            }
            dateError={errors.appointmentDate?.message}
            timeError={errors.appointmentTime?.message}
          />
        </section>
      ) : null}

      {step === 4 ? (
        <section className="space-y-4">
          <div>
            <h3 className="text-section">Review request</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Confirm these details before submitting.
            </p>
          </div>
          <dl className="space-y-4 rounded-xl border bg-card p-5">
            <div>
              <dt className="text-caption">Document</dt>
              <dd className="mt-1 text-sm font-medium">
                {selectedDocument?.name ?? "Not selected"}
              </dd>
              {selectedDocument ? (
                <p className="mt-1 text-caption">
                  {selectedDocument.processingLabel}
                </p>
              ) : null}
            </div>
            <div>
              <dt className="text-caption">Purpose</dt>
              <dd className="mt-1 text-sm leading-6">{values.purpose}</dd>
            </div>
            {values.remarks?.trim() ? (
              <div>
                <dt className="text-caption">Additional notes</dt>
                <dd className="mt-1 text-sm leading-6">{values.remarks}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-caption">Appointment</dt>
              <dd className="mt-1 text-sm font-medium">
                {values.appointmentDate && values.appointmentTime
                  ? formatAppointmentSlot(
                      values.appointmentDate,
                      values.appointmentTime
                    )
                  : "Not selected"}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      <div className="sticky bottom-0 z-10 -mx-4 mt-6 border-t bg-background/95 px-4 py-3 backdrop-blur-sm md:static md:mx-0 md:mt-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <div className="flex gap-2">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => {
                setFormError(null);
                setStep((current) => current - 1);
              }}
            >
              Back
            </Button>
          ) : null}
          {step < 4 ? (
            <Button type="button" className="flex-1 sm:ml-auto sm:flex-none" onClick={goNext}>
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              className="flex-1 sm:ml-auto sm:flex-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              Submit request
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
