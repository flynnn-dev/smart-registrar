import type { DashboardStats } from "@/lib/student/dashboard";
import { cn } from "@/lib/utils";

type StatCardsProps = {
  stats: DashboardStats;
};

export function StatCards({ stats }: StatCardsProps) {
  const items = [
    {
      label: "Active Requests",
      value: String(stats.activeRequests),
      compact: false,
    },
    {
      label: "Ready for Pickup",
      value: String(stats.readyForPickup),
      compact: false,
    },
    {
      label: "Upcoming Appointment",
      value: stats.upcomingAppointment ?? "None",
      compact: Boolean(stats.upcomingAppointment),
    },
    {
      label: "Completed Requests",
      value: String(stats.completedRequests),
      compact: false,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border bg-card px-4 py-4">
          <p className="text-caption">{item.label}</p>
          <p
            className={cn(
              "mt-2 font-semibold tracking-tight",
              item.compact ? "text-base leading-6" : "text-2xl"
            )}
          >
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
