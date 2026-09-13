import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthFrame } from "@/components/auth/auth-frame";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { requireAuthContext } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Update password",
};

export default async function UpdatePasswordPage() {
  const context = await requireAuthContext();

  return (
    <AuthFrame>
      <AuthCard
        title="Choose a new password"
        description="Use a password that is at least 8 characters."
      >
        <UpdatePasswordForm role={context.profile.role} />
      </AuthCard>
    </AuthFrame>
  );
}
