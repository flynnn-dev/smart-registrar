import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { redirectIfAuthenticated } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sign in",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await redirectIfAuthenticated();
  const params = await searchParams;
  const callbackFailed = params.error === "auth";

  return (
    <AuthCard
      title="Sign in"
      description="Use your school email to continue to Smart Registrar."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Need an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      }
    >
      {callbackFailed ? (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          The sign-in link is invalid or has expired. Please try again.
        </p>
      ) : null}
      <LoginForm nextPath={params.next} />
    </AuthCard>
  );
}
