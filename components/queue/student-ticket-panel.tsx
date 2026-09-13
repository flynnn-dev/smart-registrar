import { StatusBadge } from "@/components/shared/status-badge";
import { formatWaitMinutes, type QueueBoard } from "@/lib/queue/types";

type StudentTicketPanelProps = {
  board: QueueBoard;
};

function waitCopy(board: QueueBoard): string {
  if (board.yourStatus === "serving") {
    return "You are being served";
  }

  if (board.yourStatus === "skipped") {
    return "Staff can call you again";
  }

  return formatWaitMinutes(board.estimatedWaitMinutes);
}

export function StudentTicketPanel({ board }: StudentTicketPanelProps) {
  const estimatedWait = waitCopy(board);
  const items = [
    {
      label: "People ahead",
      value: board.peopleAhead === null ? "—" : String(board.peopleAhead),
      compact: false,
    },
    {
      label: "Estimated wait",
      value: estimatedWait,
      compact: estimatedWait.length > 12,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      <div className="surface-card col-span-2 bg-linear-to-b from-primary/8 to-transparent px-5 py-5">
        <p className="text-caption uppercase tracking-[0.18em]">Your number</p>
        <p className="mt-2 font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
          {board.yourNumber ?? "—"}
        </p>
      </div>
      {items.map((item) => (
        <div key={item.label} className="surface-card px-4 py-4">
          <p className="text-caption">{item.label}</p>
          <p
            className={
              item.compact
                ? "mt-2 text-base font-semibold leading-6 tracking-tight"
                : "mt-2 text-2xl font-semibold tracking-tight"
            }
          >
            {item.value}
          </p>
        </div>
      ))}
      <div className="surface-card col-span-2 px-4 py-4 sm:col-span-1">
        <p className="text-caption">Your status</p>
        <div className="mt-3">
          {board.yourStatus ? (
            <StatusBadge kind="queue" status={board.yourStatus} />
          ) : (
            <p className="text-2xl font-semibold tracking-tight">—</p>
          )}
        </div>
      </div>
    </section>
  );
}
