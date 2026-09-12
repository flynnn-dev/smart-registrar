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
