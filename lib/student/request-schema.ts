import { z } from "zod";

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Select an appointment date");

const timeSchema = z
  .string()
  .trim()
  .regex(/^\d{2}:\d{2}(?::\d{2})?$/, "Select an appointment time");

export const documentRequestSchema = z.object({
  documentTypeId: z.string().uuid("Select a document type"),
  purpose: z
    .string()
    .trim()
    .min(10, "Describe the purpose in at least 10 characters")
    .max(500, "Purpose is too long"),
  remarks: z
    .string()
    .trim()
    .max(500, "Notes are too long")
    .optional()
    .or(z.literal("")),
  appointmentDate: dateSchema,
  appointmentTime: timeSchema,
});

export type DocumentRequestValues = z.infer<typeof documentRequestSchema>;

export const requestStepSchemas = {
  1: documentRequestSchema.pick({ documentTypeId: true }),
  2: documentRequestSchema.pick({ purpose: true, remarks: true }),
  3: documentRequestSchema.pick({
    appointmentDate: true,
    appointmentTime: true,
  }),
} as const;

export function firstRequestStepError(
  step: keyof typeof requestStepSchemas,
  values: DocumentRequestValues
): { field: keyof DocumentRequestValues; message: string } | null {
  const parsed = requestStepSchemas[step].safeParse(values);

  if (parsed.success) {
    return null;
  }

  const issue = parsed.error.issues[0];
  const field = issue?.path[0];

  if (typeof field !== "string" || !issue?.message) {
    return {
      field: "documentTypeId",
      message: "Check this step and try again.",
    };
  }

  return {
    field: field as keyof DocumentRequestValues,
    message: issue.message,
  };
}
