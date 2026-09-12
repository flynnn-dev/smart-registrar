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
      label: "Your number",
      value: board.yourNumber ?? "—",
      mono: true,
      compact: false,
    },
    {
      label: "People ahead",
      value:
        board.peopleAhead === null ? "—" : String(board.peopleAhead),
      mono: false,
      compact: false,
    },
    {
      label: "Estimated wait",
      value: estimatedWait,
      mono: false,
      compact: estimatedWait.length > 12,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border bg-card px-4 py-4">
          <p className="text-caption">{item.label}</p>
          <p
            className={
              item.mono
                ? "mt-2 font-mono text-2xl font-semibold tracking-tight"
                : item.compact
                  ? "mt-2 text-base font-semibold leading-6 tracking-tight"
                  : "mt-2 text-2xl font-semibold tracking-tight"
            }
          >
            {item.value}
          </p>
        </div>
      ))}
      <div className="rounded-lg border bg-card px-4 py-4">
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
