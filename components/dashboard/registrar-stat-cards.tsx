import type { RegistrarDashboardStats } from "@/lib/registrar/dashboard-types";

type RegistrarStatCardsProps = {
  stats: RegistrarDashboardStats;
};

export function RegistrarStatCards({ stats }: RegistrarStatCardsProps) {
  const items = [
    { label: "Today's Requests", value: stats.todaysRequests },
    { label: "Pending Requests", value: stats.pendingRequests },
    { label: "Processing", value: stats.processing },
    { label: "Ready for Pickup", value: stats.readyForPickup },
    { label: "Completed Today", value: stats.completedToday },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="surface-card px-4 py-4">
          <p className="text-caption">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
