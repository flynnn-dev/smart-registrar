import type { Metadata } from "next";

import { LegalPage } from "@/components/landing/legal-page";
import { APP_NAME, APP_SCHOOL_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy" updated="September 12, 2026">
      <p>
        {APP_NAME} is a student-project demonstration for {APP_SCHOOL_NAME}.
        Accounts and request records are used only to operate the registrar
        queue and document request workflow.
      </p>
      <p>
        We store the name, student ID, email, and optional phone number that you
        provide, plus the requests and appointments you create. Registrar staff
        can see the records they need to process those requests.
      </p>
      <p>
        Do not submit real personal information that you are not comfortable
        sharing in a class demonstration. This page is a placeholder, not a
        formal privacy policy.
      </p>
    </LegalPage>
  );
}
