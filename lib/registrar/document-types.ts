import "server-only";

import {
  DOCUMENT_TYPE_PAGE_SIZE,
  type StaffDocumentTypeFilters,
} from "@/lib/registrar/document-type-filters";
import type { StaffDocumentType } from "@/lib/registrar/document-type-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StaffDocumentTypeListData = {
  documentTypes: StaffDocumentType[];
  total: number;
  page: number;
  pageCount: number;
};

type DocumentTypeRow = {
  id: string;
  name: string;
  description: string | null;
  processing_days: number;
  is_active: boolean;
  updated_at: string;
  document_requests: { count: number }[] | { count: number } | null;
};

function requestCount(value: DocumentTypeRow["document_requests"]): number {
  if (!value) {
    return 0;
  }

  const row = Array.isArray(value) ? value[0] : value;
  return row?.count ?? 0;
}

function toStaffDocumentType(row: DocumentTypeRow): StaffDocumentType {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    processingDays: row.processing_days,
    isActive: row.is_active,
    requestCount: requestCount(row.document_requests),
    updatedAt: row.updated_at,
  };
}

const LIST_SELECT =
  "id, name, description, processing_days, is_active, updated_at, document_requests(count)";

export async function getStaffDocumentTypeList(
  filters: StaffDocumentTypeFilters
): Promise<StaffDocumentTypeListData> {
  const supabase = await createSupabaseServerClient();
  const from = (filters.page - 1) * DOCUMENT_TYPE_PAGE_SIZE;
  const to = from + DOCUMENT_TYPE_PAGE_SIZE - 1;

  let query = supabase
    .from("document_types")
    .select(LIST_SELECT, { count: "exact" });

  if (filters.activity === "active") {
    query = query.eq("is_active", true);
  } else if (filters.activity === "inactive") {
    query = query.eq("is_active", false);
  }

  if (filters.q) {
    query = query.or(
      `name.ilike.%${filters.q}%,description.ilike.%${filters.q}%`
    );
  }

  const { data, error, count } = await query
    .order("name", { ascending: true })
    .range(from, to);

  if (error) {
    throw new Error(`Unable to load document types: ${error.message}`);
  }

  const total = count ?? 0;

  return {
    documentTypes: ((data ?? []) as DocumentTypeRow[]).map(toStaffDocumentType),
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / DOCUMENT_TYPE_PAGE_SIZE)),
  };
}
