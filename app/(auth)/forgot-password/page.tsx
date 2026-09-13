import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthFrame } from "@/components/auth/auth-frame";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { redirectIfAuthenticated } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Reset password",
};

export default async function ForgotPasswordPage() {
  await redirectIfAuthenticated();

  return (
    <AuthFrame>
      <AuthCard
        title="Reset your password"
        description="Enter the email on your account and we will send a reset link."
        footer={
          <p className="text-center text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        }
      >
        <ForgotPasswordForm />
      </AuthCard>
    </AuthFrame>
  );
}
