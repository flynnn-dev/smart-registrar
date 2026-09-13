import { notFound } from "next/navigation";
import { ClipboardList, FilePlus2 } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { SupabaseStatusCard } from "@/components/shared/supabase-status";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { studentNavigation, type NavItem } from "@/lib/navigation";
import {
  APPOINTMENT_STATUSES,
  QUEUE_STATUSES,
  REQUEST_STATUSES,
} from "@/lib/status";
import { getSupabaseConnectionStatus } from "@/lib/supabase/health";

const previewNavigation: NavItem[] = studentNavigation.map((item) => ({
  ...item,
  href: `/dev/foundation#${item.label.toLowerCase().replace(/\s+/g, "-")}`,
}));

const previewUser = {
  name: "Maria Santos",
  email: "maria.santos@university.edu",
  role: "student" as const,
  studentId: "2026-00123",
};

const statCards = [
  { label: "Active Requests", value: "2" },
  { label: "Ready for Pickup", value: "1" },
  { label: "Upcoming Appointment", value: "Tue, 9:30 AM" },
  { label: "Completed Requests", value: "4" },
];

export const dynamic = "force-dynamic";

const tokenSwatches = [
  { name: "Primary", className: "bg-primary" },
  { name: "Brand", className: "bg-brand" },
  { name: "Ink", className: "bg-ink" },
  { name: "Warm", className: "bg-warm" },
  { name: "Foreground", className: "bg-foreground" },
  { name: "Muted", className: "bg-muted ring-1 ring-border" },
  { name: "Border", className: "bg-background ring-1 ring-border" },
  { name: "Sidebar", className: "bg-sidebar ring-1 ring-sidebar-border" },
  { name: "Destructive", className: "bg-destructive" },
];

export default async function FoundationPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const supabaseStatus = await getSupabaseConnectionStatus();

  return (
    <AppShell
      title="Foundation preview"
      navigation={previewNavigation}
      user={previewUser}
      inbox={{ unreadCount: 0, recent: [] }}
    >
      <div className="space-y-10">
        <PageHeader
          title={`Welcome to ${APP_NAME}`}
          description={`${APP_TAGLINE}. This is the Phase 1 design preview. Authentication lives on the public site.`}
        />

        <SupabaseStatusCard status={supabaseStatus} />

        <section className="space-y-2">
          <p className="text-page-title">Good afternoon, Maria</p>
          <p className="text-body text-muted-foreground">
            Manage your registrar requests and appointments.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-lg border bg-card px-4 py-4"
            >
              <p className="text-caption">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h3 className="text-section">Typography</h3>
          <div className="space-y-3 rounded-lg border bg-card px-5 py-5">
            <p className="text-page-title">Page heading</p>
            <p className="text-section">Section heading</p>
            <p className="text-card-title">Card title</p>
            <p className="text-body">
              Body text stays comfortable and readable for registrar workflows.
            </p>
            <p className="text-caption">Supporting caption and metadata</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-section">Color tokens</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {tokenSwatches.map((swatch) => (
              <div key={swatch.name} className="space-y-2">
                <div className={`h-14 rounded-md ${swatch.className}`} />
                <p className="text-caption">{swatch.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-section">Request statuses</h3>
          <div className="flex flex-wrap gap-2">
            {REQUEST_STATUSES.map((status) => (
              <StatusBadge key={status} kind="request" status={status} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-section">Appointment & queue statuses</h3>
          <div className="flex flex-wrap gap-2">
            {APPOINTMENT_STATUSES.map((status) => (
              <StatusBadge
                key={`appointment-${status}`}
                kind="appointment"
                status={status}
              />
            ))}
            {QUEUE_STATUSES.map((status) => (
              <StatusBadge key={`queue-${status}`} kind="queue" status={status} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-section">Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button>
              <FilePlus2 />
              New request
            </Button>
            <Button variant="outline">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Reject</Button>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Empty state</CardTitle>
              <CardDescription>
                Used when a student has no records yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={ClipboardList}
                title="No active requests"
                description="You haven't submitted a document request yet."
                action={<Button>Start a request</Button>}
              />
            </CardContent>
          </Card>
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Loading state</CardTitle>
              <CardDescription>
                Skeleton placeholders keep the page from flashing empty.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PageSkeleton />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
