import type { Metadata } from "next";

import { LegalPage } from "@/components/landing/legal-page";
import { APP_NAME, APP_SCHOOL_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms" updated="September 12, 2026">
      <p>
        {APP_NAME} is provided as a student project for {APP_SCHOOL_NAME}. It
        does not issue official documents, collect payments, or replace the
        registrar office.
      </p>
      <p>
        You are responsible for the accuracy of the details you submit. Request
        numbers, appointment slots, and status updates are for demonstration and
        campus workflow practice only.
      </p>
      <p>
        These terms are a placeholder for the project. They are not a legal
        agreement.
      </p>
    </LegalPage>
  );
}
