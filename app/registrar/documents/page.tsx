import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { DocumentTypeFilters } from "@/components/documents/document-type-filters";
import { DocumentTypeManager } from "@/components/documents/document-type-manager";
import { DocumentTypePagination } from "@/components/documents/document-type-pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { requireStaffContext } from "@/lib/auth/session";
import { parseStaffDocumentTypeFilters } from "@/lib/registrar/document-type-filters";
import { getStaffDocumentTypeList } from "@/lib/registrar/document-types";

export const metadata: Metadata = {
  title: "Documents",
};

export const dynamic = "force-dynamic";

type RegistrarDocumentsPageProps = {
  searchParams: Promise<{
    q?: string;
    activity?: string;
    page?: string;
  }>;
};

export default async function RegistrarDocumentsPage({
  searchParams,
}: RegistrarDocumentsPageProps) {
  await requireStaffContext();
  const filters = parseStaffDocumentTypeFilters(await searchParams);
  const data = await getStaffDocumentTypeList(filters);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Documents"
        description="Manage the document types students can request from the registrar."
      />

      <DocumentTypeFilters filters={filters} />

      <div className="space-y-4">
        <DocumentTypeManager documentTypes={data.documentTypes} />
        {data.documentTypes.length === 0 ? (
          <div className="rounded-xl border bg-card">
            <EmptyState
              icon={FileText}
              title="No document types match these filters"
              description="Try another status or search term, or add a new document type."
            />
          </div>
        ) : (
          <DocumentTypePagination
            filters={filters}
            total={data.total}
            pageCount={data.pageCount}
          />
        )}
      </div>
    </div>
  );
}
