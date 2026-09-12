import { CheckCircle2, CircleAlert, CircleDashed } from "lucide-react";

import type { SupabaseConnectionStatus } from "@/lib/supabase/health";

type SupabaseStatusCardProps = {
  status: SupabaseConnectionStatus;
};

export function SupabaseStatusCard({ status }: SupabaseStatusCardProps) {
  if (status.state === "connected") {
    return (
      <div className="flex items-start gap-3 rounded-lg border bg-status-completed-bg/60 px-4 py-3">
        <CheckCircle2
          className="mt-0.5 size-4 text-status-completed"
          aria-hidden
        />
        <div>
          <p className="text-sm font-medium text-foreground">
            Supabase connected
          </p>
          <p className="text-caption">
            {status.projectHost}
            {status.schemaReady
              ? ` · ${status.documentTypeCount} document types ready`
              : " · schema not applied yet"}
          </p>
        </div>
      </div>
    );
  }

  if (status.state === "error") {
    return (
      <div className="flex items-start gap-3 rounded-lg border bg-status-rejected-bg/60 px-4 py-3">
        <CircleAlert
          className="mt-0.5 size-4 text-status-rejected"
          aria-hidden
        />
        <div>
          <p className="text-sm font-medium text-foreground">
            Supabase connection failed
          </p>
          <p className="text-caption">{status.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-muted/50 px-4 py-3">
      <CircleDashed className="mt-0.5 size-4 text-muted-foreground" aria-hidden />
      <div>
        <p className="text-sm font-medium text-foreground">
          Supabase is not configured
        </p>
        <p className="text-caption">
          Add your project URL and anon key to `.env.local`, then restart the
          dev server.
        </p>
      </div>
    </div>
  );
}
