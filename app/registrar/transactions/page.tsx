import type { Metadata } from "next";
import { ReceiptText } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionPagination } from "@/components/transactions/transaction-pagination";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { requireStaffContext } from "@/lib/auth/session";
import { parseStaffTransactionFilters } from "@/lib/registrar/transaction-filters";
import { getStaffTransactionList } from "@/lib/registrar/transactions";

export const metadata: Metadata = {
  title: "Transactions",
};

export const dynamic = "force-dynamic";

type RegistrarTransactionsPageProps = {
  searchParams: Promise<{
    q?: string;
    action?: string;
    date?: string;
    page?: string;
  }>;
};

export default async function RegistrarTransactionsPage({
  searchParams,
}: RegistrarTransactionsPageProps) {
  await requireStaffContext();
  const filters = parseStaffTransactionFilters(await searchParams);
  const data = await getStaffTransactionList(filters);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Transactions"
        description="Audit request, appointment, and queue activity across the office."
      />

      <TransactionFilters filters={filters} />

      {data.transactions.length === 0 ? (
        <div className="rounded-xl border bg-card">
          <EmptyState
            icon={ReceiptText}
            title="No transactions match these filters"
            description="Try another action, date range, or search term."
          />
        </div>
      ) : (
        <div className="space-y-4">
          <TransactionTable transactions={data.transactions} />
          <TransactionPagination
            filters={filters}
            total={data.total}
            pageCount={data.pageCount}
          />
        </div>
      )}
    </div>
  );
}
