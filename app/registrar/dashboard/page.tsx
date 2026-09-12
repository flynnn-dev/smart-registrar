import type { Metadata } from "next";
import Link from "next/link";

import { RegistrarStatCards } from "@/components/dashboard/registrar-stat-cards";
import { RequestActivity } from "@/components/dashboard/request-activity";
import { TodayWindow } from "@/components/dashboard/today-window";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { requireStaffContext } from "@/lib/auth/session";
import {
  firstNameFromFullName,
  getDayGreeting,
} from "@/lib/format/datetime";
import { getRegistrarDashboardData } from "@/lib/registrar/dashboard";

export const metadata: Metadata = {
  title: "Registrar dashboard",
};

export const dynamic = "force-dynamic";

export default async function RegistrarDashboardPage() {
  const { profile } = await requireStaffContext();
  const dashboard = await getRegistrarDashboardData();
  const firstName = firstNameFromFullName(profile.full_name);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${getDayGreeting()}, ${firstName}`}
        description="Oversee the registrar window and request activity across the office."
        actions={
          <Button asChild>
            <Link href="/registrar/requests">Review requests</Link>
          </Button>
        }
      />

      <RegistrarStatCards stats={dashboard.stats} />
      <TodayWindow today={dashboard.today} />
      <RequestActivity data={dashboard} />
    </div>
  );
}
