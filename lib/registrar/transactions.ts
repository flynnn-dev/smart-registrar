import "server-only";

import {
  TRANSACTION_PAGE_SIZE,
  transactionDateBounds,
  type StaffTransactionFilters,
} from "@/lib/registrar/transaction-filters";
import {
  describeTransactionAction,
  type StaffTransaction,
} from "@/lib/registrar/transaction-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StaffTransactionListData = {
  transactions: StaffTransaction[];
  total: number;
  page: number;
  pageCount: number;
};

type ProfileEmbed = {
  full_name: string | null;
  student_id?: string | null;
};

type TransactionRow = {
  id: string;
  action: string;
  remarks: string | null;
  created_at: string;
  request_id: string | null;
  student_id: string | null;
  performed_by: string | null;
  document_requests:
    | {
        request_number: string;
        document_types: { name: string } | { name: string }[] | null;
      }
    | {
        request_number: string;
        document_types: { name: string } | { name: string }[] | null;
      }[]
    | null;
  performer: ProfileEmbed | ProfileEmbed[] | null;
  student: ProfileEmbed | ProfileEmbed[] | null;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function toTransaction(row: TransactionRow): StaffTransaction {
  const request = one(row.document_requests);
  const performer = one(row.performer);
  const student = one(row.student);

  return {
    id: row.id,
    createdAt: row.created_at,
    action: row.action,
    actionLabel: describeTransactionAction(row.action, row.remarks),
    remarks: row.remarks,
    requestId: row.request_id,
    requestNumber: request?.request_number ?? null,
    documentName: one(request?.document_types)?.name ?? null,
    studentUserId: row.student_id,
    studentName: student?.full_name?.trim() || null,
    studentCampusId: student?.student_id ?? null,
    performerName: performer?.full_name?.trim() || null,
  };
}

const LIST_SELECT =
  "id, action, remarks, created_at, request_id, student_id, performed_by, document_requests(request_number, document_types(name)), performer:profiles!transaction_records_performed_by_fkey(full_name), student:profiles!transaction_records_student_id_fkey(full_name, student_id)";

export async function getStaffTransactionList(
  filters: StaffTransactionFilters
): Promise<StaffTransactionListData> {
  const supabase = await createSupabaseServerClient();
  const bounds = transactionDateBounds(filters.date);
  const from = (filters.page - 1) * TRANSACTION_PAGE_SIZE;
  const to = from + TRANSACTION_PAGE_SIZE - 1;

  let matchingProfileIds: string[] = [];
  let matchingRequestIds: string[] = [];

  if (filters.q) {
    const [profileResult, requestResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("id")
        .or(
          `full_name.ilike.%${filters.q}%,student_id.ilike.%${filters.q}%`
        ),
      supabase
        .from("document_requests")
        .select("id")
        .ilike("request_number", `%${filters.q}%`),
    ]);

    if (profileResult.error) {
      throw new Error(`Unable to search people: ${profileResult.error.message}`);
    }

    if (requestResult.error) {
      throw new Error(
        `Unable to search requests: ${requestResult.error.message}`
      );
    }

    matchingProfileIds = (profileResult.data ?? []).map((row) => row.id);
    matchingRequestIds = (requestResult.data ?? []).map((row) => row.id);
  }

  let query = supabase
    .from("transaction_records")
    .select(LIST_SELECT, { count: "exact" });

  if (filters.action !== "all") {
    query = query.eq("action", filters.action);
  }

  if (bounds.start) {
    query = query.gte("created_at", bounds.start);
  }

  if (bounds.end) {
    query = query.lt("created_at", bounds.end);
  }

  if (filters.q) {
    const clauses = [`remarks.ilike.%${filters.q}%`, `action.ilike.%${filters.q}%`];

    if (matchingProfileIds.length > 0) {
      clauses.push(`student_id.in.(${matchingProfileIds.join(",")})`);
      clauses.push(`performed_by.in.(${matchingProfileIds.join(",")})`);
    }

    if (matchingRequestIds.length > 0) {
      clauses.push(`request_id.in.(${matchingRequestIds.join(",")})`);
    }

    query = query.or(clauses.join(","));
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Unable to load transactions: ${error.message}`);
  }

  const total = count ?? 0;

  return {
    transactions: ((data ?? []) as TransactionRow[]).map(toTransaction),
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / TRANSACTION_PAGE_SIZE)),
  };
}
