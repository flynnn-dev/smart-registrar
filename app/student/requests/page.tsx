import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

import { RequestCard } from "@/components/requests/request-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { requireStudentContext } from "@/lib/auth/session";
import { getStudentRequests } from "@/lib/student/requests";

export const metadata: Metadata = {
  title: "My Requests",
};

export const dynamic = "force-dynamic";

export default async function StudentRequestsPage() {
  const { userId } = await requireStudentContext();
  const lists = await getStudentRequests(userId);
  const empty = lists.active.length === 0 && lists.past.length === 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Requests"
        description="Track every document request from submission to pickup."
        actionsClassName="max-md:hidden"
        actions={
          <Button asChild>
            <Link href="/student/requests/new">New request</Link>
          </Button>
        }
      />

      {empty ? (
        <div className="rounded-xl border bg-card">
          <EmptyState
            icon={ClipboardList}
            title="No requests yet"
            description="Submit a document request to get a tracking number and appointment."
            action={
              <Button asChild>
                <Link href="/student/requests/new">Start a request</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <h3 className="text-section">Active</h3>
            {lists.active.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You have no requests in progress.
              </p>
            ) : (
              <div className="space-y-3">
                {lists.active.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-section">Past</h3>
            {lists.past.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Completed or rejected requests will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {lists.past.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
