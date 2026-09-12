import Link from "next/link";

import { formatDateTime } from "@/lib/format/datetime";
import type { StaffTransaction } from "@/lib/registrar/transaction-types";

type TransactionTableProps = {
  transactions: StaffTransaction[];
};

function RequestCell({ transaction }: { transaction: StaffTransaction }) {
  const number = transaction.requestNumber ?? "—";
  const title = transaction.requestId ? (
    <Link
      href={`/registrar/requests/${transaction.requestId}`}
      className="font-mono hover:underline"
    >
      {number}
    </Link>
  ) : (
    <span className="font-mono">{number}</span>
  );

  return (
    <div>
      <p>{title}</p>
      {transaction.documentName ? (
        <p className="text-caption">{transaction.documentName}</p>
      ) : null}
      {transaction.studentName ? (
        transaction.studentUserId ? (
          <Link
            href={`/registrar/students/${transaction.studentUserId}`}
            className="text-caption hover:underline"
          >
            {transaction.studentName}
            {transaction.studentCampusId
              ? ` · ${transaction.studentCampusId}`
              : ""}
          </Link>
        ) : (
          <p className="text-caption">{transaction.studentName}</p>
        )
      ) : null}
    </div>
  );
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {transactions.map((transaction) => (
          <article
            key={transaction.id}
            className="space-y-3 rounded-xl border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{transaction.actionLabel}</p>
              <p className="shrink-0 text-caption">
                {formatDateTime(transaction.createdAt)}
              </p>
            </div>
            <RequestCell transaction={transaction} />
            <p className="text-caption">
              {transaction.performerName || "System"}
            </p>
            {transaction.remarks ? (
              <p className="text-sm text-muted-foreground">{transaction.remarks}</p>
            ) : null}
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border md:block">
        <table className="w-full min-w-5xl text-sm">
          <thead className="border-b bg-muted/40 text-left text-caption">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Request</th>
              <th className="px-4 py-3 font-medium">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b last:border-0">
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDateTime(transaction.createdAt)}
                </td>
                <td className="px-4 py-3">
                  {transaction.performerName || "System"}
                </td>
                <td className="px-4 py-3 font-medium">
                  {transaction.actionLabel}
                </td>
                <td className="px-4 py-3">
                  <RequestCell transaction={transaction} />
                </td>
                <td className="max-w-sm px-4 py-3 text-muted-foreground">
                  {transaction.remarks || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
