import type { Metadata } from "next";
import Link from "next/link";

import { ActiveRequestPanel } from "@/components/dashboard/active-request-panel";
import { StatCards } from "@/components/dashboard/stat-cards";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { requireStudentContext } from "@/lib/auth/session";
import {
  firstNameFromFullName,
  getDayGreeting,
} from "@/lib/format/datetime";
import { getStudentDashboardData } from "@/lib/student/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const { userId, profile } = await requireStudentContext();
  const dashboard = await getStudentDashboardData(userId);
  const firstName = firstNameFromFullName(profile.full_name);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${getDayGreeting()}, ${firstName}`}
        description="Manage your registrar requests and appointments."
        actionsClassName="max-md:hidden"
        actions={
          <Button asChild>
            <Link href="/student/requests/new">New request</Link>
          </Button>
        }
      />

      <ActiveRequestPanel request={dashboard.featuredRequest} />
      <StatCards stats={dashboard.stats} />
    </div>
  );
}
