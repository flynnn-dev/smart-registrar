"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { getAuthCallbackUrl, homePathForRole } from "@/lib/auth/paths";
import { registerSchema, type RegisterValues } from "@/lib/auth/schemas";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      studentId: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    setFormError(null);

    const supabase = createSupabaseBrowserClient();
    const { data: available, error: availabilityError } = await supabase.rpc(
      "is_student_id_available",
      { p_student_id: values.studentId }
    );

    if (!availabilityError && available === false) {
      setError("studentId", {
        message: "This student ID is already registered.",
      });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: getAuthCallbackUrl(homePathForRole("student")),
        data: {
          full_name: values.fullName,
          student_id: values.studentId,
          phone: values.phone,
        },
      },
    });

    if (error) {
      setFormError(getAuthErrorMessage(error));
      return;
    }

    if (!data.session) {
      setNeedsConfirmation(true);
      return;
    }

    router.push(homePathForRole("student"));
    router.refresh();
  }

  if (needsConfirmation) {
    return (
      <div className="rounded-md border bg-muted/40 px-4 py-4 text-sm">
        <p className="font-medium">Confirm your email to finish signing up.</p>
        <p className="mt-1 text-muted-foreground">
          We sent a confirmation link to your inbox. After you confirm, you can
          sign in.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError ? (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <FormField
        label="Full name"
        htmlFor="fullName"
        error={errors.fullName?.message}
      >
        <Input
          id="fullName"
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName)}
          {...register("fullName")}
        />
      </FormField>

      <FormField
        label="Student ID"
        htmlFor="studentId"
        hint="Example: 2026-00123"
        error={errors.studentId?.message}
      >
        <Input
          id="studentId"
          autoComplete="off"
          aria-invalid={Boolean(errors.studentId)}
          {...register("studentId")}
        />
      </FormField>

      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </FormField>

      <FormField
        label="Phone"
        htmlFor="phone"
        hint="Optional"
        error={errors.phone?.message}
      >
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
      </FormField>

      <FormField
        label="Confirm password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        Create account
      </Button>
    </form>
  );
}
