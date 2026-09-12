import type { Metadata } from "next";

import { ProfileForm } from "@/components/auth/profile-form";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireStudentContext } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function StudentProfilePage() {
  const { profile } = await requireStudentContext();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="Update the details the registrar uses to identify your requests."
      />
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Account details</CardTitle>
          <CardDescription>
            Email and role cannot be changed from this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
