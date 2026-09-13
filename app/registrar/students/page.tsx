import type { Metadata } from "next";
import { Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StudentFilters } from "@/components/students/student-filters";
import { StudentPagination } from "@/components/students/student-pagination";
import { StudentTable } from "@/components/students/student-table";
import { requireStaffContext } from "@/lib/auth/session";
import { parseStaffStudentFilters } from "@/lib/registrar/student-filters";
import { getStaffStudentList } from "@/lib/registrar/students";

export const metadata: Metadata = {
  title: "Students",
};

export const dynamic = "force-dynamic";

type RegistrarStudentsPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function RegistrarStudentsPage({
  searchParams,
}: RegistrarStudentsPageProps) {
  await requireStaffContext();
  const filters = parseStaffStudentFilters(await searchParams);
  const data = await getStaffStudentList(filters);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Students"
        description="Look up student contact details and request history."
      />

      <StudentFilters filters={filters} />

      {data.students.length === 0 ? (
        <div className="surface-card">
          <EmptyState
            icon={Users}
            title="No students match this search"
            description="Try a name, campus student ID, email, or contact number."
          />
        </div>
      ) : (
        <div className="space-y-4">
          <StudentTable students={data.students} />
          <StudentPagination
            filters={filters}
            total={data.total}
            pageCount={data.pageCount}
          />
        </div>
      )}
    </div>
  );
}
