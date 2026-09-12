import type { Metadata } from "next";
import Link from "next/link";

import { PublicHeader } from "@/components/layout/public-header";
import { Button } from "@/components/ui/button";
import { getAuthContext } from "@/lib/auth/session";
import { homePathForRole } from "@/lib/auth/paths";

export const metadata: Metadata = {
  title: "Unauthorized",
};

export default async function UnauthorizedPage() {
  const context = await getAuthContext();
  const homeHref = context ? homePathForRole(context.profile.role) : "/";

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PublicHeader showActions={!context} />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
        <p className="text-page-title">You do not have access</p>
        <p className="mt-2 text-body text-muted-foreground">
          That page is limited to registrar staff. If you think this is a
          mistake, ask an administrator to update your role.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href={homeHref}>Go back</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
