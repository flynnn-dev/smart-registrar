import Link from "next/link";
import { FileText } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/brand";

export function LandingHero() {
  return (
    <section className="border-b bg-linear-to-b from-secondary/70 to-background">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-caption font-medium uppercase tracking-[0.16em]">
            {APP_NAME}
          </p>
          <h1 className="text-hero text-balance">Smarter Registrar Services.</h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {APP_DESCRIPTION}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <aside
          aria-label="Example request progress"
          className="rounded-xl border bg-card p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-caption">Sample request</p>
              <p className="mt-1 text-sm font-medium">REG-2026-000184</p>
            </div>
            <StatusBadge kind="request" status="processing" />
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-3">
              <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FileText className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  Transcript of Records
                </p>
                <p className="text-caption">Appointment reserved · Tue, 9:30 AM</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge kind="request" status="submitted" />
              <StatusBadge kind="request" status="under_review" />
              <StatusBadge kind="request" status="ready_for_pickup" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
