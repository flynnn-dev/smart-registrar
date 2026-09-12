import { z } from "zod";

export const STUDENT_ID_PATTERN = /^\d{4}-\d{5}$/;
export const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{7,18}$/;

const emailSchema = z.email("Enter a valid email address");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");
const studentIdSchema = z
  .string()
  .trim()
  .regex(STUDENT_ID_PATTERN, "Use the format 2026-00123");
const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Enter your full name")
  .max(80, "Name is too long");
const phoneSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || PHONE_PATTERN.test(value),
    "Enter a valid phone number"
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    studentId: studentIdSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  fullName: fullNameSchema,
  studentId: studentIdSchema,
  phone: phoneSchema,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
