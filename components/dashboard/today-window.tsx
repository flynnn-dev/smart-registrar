import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { RegistrarTodayWindow } from "@/lib/registrar/dashboard-types";

type TodayWindowProps = {
  today: RegistrarTodayWindow;
};

export function TodayWindow({ today }: TodayWindowProps) {
  const items = [
    {
      label: "Now serving",
      value: today.servingNumber ?? "—",
    },
    {
      label: "Waiting in queue",
      value: String(today.waitingCount),
    },
    {
      label: "Appointments today",
      value:
        today.appointmentsToday === 0
          ? "None"
          : `${today.appointmentsOpen} open · ${today.appointmentsToday} total`,
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-section">Today at the window</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            What the registrar desk is seeing right now.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/registrar/queue">Open queue</Link>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/registrar/appointments">Open appointments</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border bg-card px-4 py-4 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-caption">{item.label}</p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
