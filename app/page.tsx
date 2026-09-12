import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LandingHero } from "@/components/landing/hero";
import { ProcessSection } from "@/components/landing/process-section";
import { PublicFooter } from "@/components/landing/public-footer";
import { ServicesSection } from "@/components/landing/services-section";
import { WhySection } from "@/components/landing/why-section";
import { PublicHeader } from "@/components/layout/public-header";
import { homePathForRole } from "@/lib/auth/paths";
import { getAuthContext } from "@/lib/auth/session";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/brand";
import {
  getPublicDocumentTypes,
  getPublicOfficeHours,
  summarizeOfficeHours,
} from "@/lib/catalog/public";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const context = await getAuthContext();

  if (context) {
    redirect(homePathForRole(context.profile.role));
  }

  const [documentTypes, officeHours] = await Promise.all([
    getPublicDocumentTypes(),
    getPublicOfficeHours(),
  ]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PublicHeader showSectionLinks />
      <main>
        <LandingHero />
        <ProcessSection />
        <ServicesSection documentTypes={documentTypes} />
        <WhySection />
      </main>
      <PublicFooter officeHours={summarizeOfficeHours(officeHours)} />
    </div>
  );
}
