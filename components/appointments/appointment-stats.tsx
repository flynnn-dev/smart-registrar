import type { AppointmentStats } from "@/lib/appointments/types";

type AppointmentStatsProps = {
  stats: AppointmentStats;
};

export function AppointmentStatsRow({ stats }: AppointmentStatsProps) {
  const items = [
    { label: "Today", value: stats.total },
    { label: "Scheduled", value: stats.scheduled },
    { label: "Checked in", value: stats.checkedIn },
    { label: "Completed", value: stats.completed },
    { label: "Cancelled", value: stats.cancelled },
    { label: "Missed", value: stats.missed },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border bg-card px-4 py-4">
          <p className="text-caption">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
