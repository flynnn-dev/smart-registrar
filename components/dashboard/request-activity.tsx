import { RequestActivityCharts } from "@/components/dashboard/request-activity-charts";
import type { RegistrarDashboardData } from "@/lib/registrar/dashboard-types";

type RequestActivityProps = {
  data: Pick<
    RegistrarDashboardData,
    "volume" | "statusDistribution" | "documentTypes"
  >;
};

export function RequestActivity({ data }: RequestActivityProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-section">Request activity</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Counts come from live request records, not sample data.
        </p>
      </div>
      <RequestActivityCharts
        volume={data.volume}
        statusDistribution={data.statusDistribution}
        documentTypes={data.documentTypes}
      />
    </section>
  );
}
