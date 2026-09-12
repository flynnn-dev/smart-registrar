import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";

import { RequestFilters } from "@/components/requests/request-filters";
import { RequestPagination } from "@/components/requests/request-pagination";
import { RequestTable } from "@/components/requests/request-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { requireStaffContext } from "@/lib/auth/session";
import { parseStaffRequestFilters } from "@/lib/registrar/request-filters";
import { getStaffRequestList } from "@/lib/registrar/requests";

export const metadata: Metadata = {
  title: "Requests",
};

export const dynamic = "force-dynamic";

type RegistrarRequestsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    document?: string;
    date?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function RegistrarRequestsPage({
  searchParams,
}: RegistrarRequestsPageProps) {
  await requireStaffContext();
  const filters = parseStaffRequestFilters(await searchParams);
  const data = await getStaffRequestList(filters);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Requests"
        description="Search, filter, and update document requests for the office."
      />

      <RequestFilters filters={filters} documentTypes={data.documentTypes} />

      {data.requests.length === 0 ? (
        <div className="rounded-xl border bg-card">
          <EmptyState
            icon={ClipboardList}
            title="No requests match these filters"
            description="Try another status, document type, or search term."
          />
        </div>
      ) : (
        <div className="space-y-4">
          <RequestTable requests={data.requests} />
          <RequestPagination
            filters={filters}
            total={data.total}
            pageCount={data.pageCount}
          />
        </div>
      )}
    </div>
  );
}
