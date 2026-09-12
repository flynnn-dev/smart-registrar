"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateStudentProfile } from "@/lib/auth/actions";
import { profileSchema, type ProfileValues } from "@/lib/auth/schemas";
import type { AuthProfile } from "@/lib/auth/types";
import { ROLE_LABELS } from "@/lib/roles";

type ProfileFormProps = {
  profile: AuthProfile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.full_name ?? "",
      studentId: profile.student_id ?? "",
      phone: profile.phone ?? "",
    },
  });

  async function onSubmit(values: ProfileValues) {
    setFormError(null);

    const result = await updateStudentProfile(values);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    toast.success("Profile updated");
    reset(values);
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError ? (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Email</p>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Role</p>
          <p className="text-sm text-muted-foreground">
            {ROLE_LABELS[profile.role]}
          </p>
        </div>
      </div>

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
        error={errors.studentId?.message}
      >
        <Input
          id="studentId"
          autoComplete="off"
          aria-invalid={Boolean(errors.studentId)}
          {...register("studentId")}
        />
      </FormField>

      <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
      </FormField>

      <Button
        type="submit"
        className="min-h-11 w-full sm:min-h-8 sm:w-auto"
        disabled={isSubmitting || !isDirty}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        Save changes
      </Button>
    </form>
  );
}
