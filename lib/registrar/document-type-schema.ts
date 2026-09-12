import { z } from "zod";

export const documentTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter a document name")
    .max(80, "Name is too long"),
  description: z
    .string()
    .trim()
    .max(280, "Description is too long")
    .optional()
    .or(z.literal("")),
  processingDays: z
    .number({ error: "Enter the number of processing days" })
    .int("Use a whole number of days")
    .min(0, "Processing time cannot be negative")
    .max(60, "Processing time must be 60 days or fewer"),
  isActive: z.boolean(),
});

export type DocumentTypeValues = z.infer<typeof documentTypeSchema>;
