import type { Metadata } from "next";

import { RequestWizard } from "@/components/requests/request-wizard";
import { PageHeader } from "@/components/shared/page-header";
import { requireStudentContext } from "@/lib/auth/session";
import {
  getAvailableAppointmentSlots,
  getRequestDocumentTypes,
} from "@/lib/student/request";

export const metadata: Metadata = {
  title: "New Request",
};

export const dynamic = "force-dynamic";

export default async function StudentNewRequestPage() {
  const { profile } = await requireStudentContext();
  const [documentTypes, slots] = await Promise.all([
    getRequestDocumentTypes(),
    getAvailableAppointmentSlots(),
  ]);

  return (
    <div className="-mx-4 -mt-6 flex min-h-full flex-col md:-mx-8 md:-my-8">
      <div className="shrink-0 px-4 pt-6 md:px-8 md:pt-8">
        <PageHeader
          title="New Request"
          description="Submit a document request and reserve a pickup appointment."
        />
      </div>
      <RequestWizard
        documentTypes={documentTypes}
        slots={slots}
        studentName={profile.full_name?.trim() || profile.email}
        studentId={profile.student_id}
      />
    </div>
  );
}
