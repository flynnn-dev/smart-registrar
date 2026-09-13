import type { QueueBoard } from "@/lib/queue/types";

type QueueStatsRowProps = {
  board: QueueBoard;
};

export function QueueStatsRow({ board }: QueueStatsRowProps) {
  const items = [
    { label: "Waiting", value: board.waitingCount },
    { label: "Serving", value: board.servingCount },
    { label: "Completed", value: board.completedCount },
    { label: "Skipped", value: board.skippedCount },
    { label: "Cancelled", value: board.cancelledCount },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
