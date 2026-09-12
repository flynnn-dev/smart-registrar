"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
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
  firstRequestStepError,
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

function clockValue(time: string) {
  return time.slice(0, 5);
}

export function RequestWizard({
  documentTypes,
  slots,
  studentName,
  studentId,
}: RequestWizardProps) {
  const router = useRouter();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
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

  useLayoutEffect(() => {
    bodyRef.current?.closest("main")?.scrollTo({ top: 0 });
  }, [step]);

  function goNext() {
    const current = step as 1 | 2 | 3;
    const issue = firstRequestStepError(current, getValues());

    if (issue) {
      setError(issue.field, { type: "manual", message: issue.message });
      setFormError(issue.message);
      toast.error(issue.message);
      bodyRef.current?.closest("main")?.scrollTo({ top: 0 });
      return;
    }

    clearErrors();
    setFormError(null);
    setStep((currentStep) => currentStep + 1);
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
    <form
      className="flex min-h-0 flex-1 flex-col pb-20"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="shrink-0 px-4 pt-6 md:px-8">
        <RequestStepper currentStep={step} />
      </div>

      {formError ? (
        <p className="mx-4 mt-4 shrink-0 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive md:mx-8">
          {formError}
        </p>
      ) : null}

      <div ref={bodyRef} className="flex-1 px-4 py-6 md:px-8">
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
            onChange={(id) => {
              setFormError(null);
              clearErrors("documentTypeId");
              setValue("documentTypeId", id, { shouldValidate: false });
            }}
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
            time={clockValue(values.appointmentTime ?? "")}
            onDateChange={(date) => {
              setFormError(null);
              clearErrors(["appointmentDate", "appointmentTime"]);
              setValue("appointmentDate", date, { shouldValidate: false });
              setValue("appointmentTime", "", { shouldValidate: false });
            }}
            onTimeChange={(time) => {
              setFormError(null);
              clearErrors("appointmentTime");
              setValue("appointmentTime", clockValue(time), {
                shouldValidate: false,
              });
            }}
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
      </div>

      <div className="fixed inset-x-0 bottom-[var(--app-tabbar)] z-20 border-t bg-background px-4 py-3 md:left-64 md:px-8 print:static">
        <div className="flex gap-2">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              className="min-h-11 flex-1 sm:min-h-8 sm:flex-none"
              onClick={() => {
                setFormError(null);
                clearErrors();
                setStep((current) => current - 1);
              }}
            >
              Back
            </Button>
          ) : null}
          {step < 4 ? (
            <Button
              type="button"
              className="min-h-11 flex-1 sm:ml-auto sm:min-h-8 sm:flex-none"
              onClick={goNext}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              className="min-h-11 flex-1 sm:ml-auto sm:min-h-8 sm:flex-none"
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
