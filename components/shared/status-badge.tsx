import {
  AlertCircle,
  Ban,
  Bell,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  Clock,
  FileSearch,
  LogIn,
  PackageCheck,
  SkipForward,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  APPOINTMENT_STATUS_LABELS,
  QUEUE_STATUS_LABELS,
  REQUEST_STATUS_LABELS,
  type AppointmentStatus,
  type QueueStatus,
  type RequestStatus,
} from "@/lib/status";
import { cn } from "@/lib/utils";

const requestStyles: Record<RequestStatus, string> = {
  submitted: "bg-status-submitted-bg text-status-submitted",
  under_review: "bg-status-under-review-bg text-status-under-review",
  processing: "bg-status-processing-bg text-status-processing",
  ready_for_pickup: "bg-status-ready-bg text-status-ready",
  completed: "bg-status-completed-bg text-status-completed",
  rejected: "bg-status-rejected-bg text-status-rejected",
};

const appointmentStyles: Record<AppointmentStatus, string> = {
  scheduled: "bg-status-scheduled-bg text-status-scheduled",
  checked_in: "bg-status-submitted-bg text-status-submitted",
  completed: "bg-status-completed-bg text-status-completed",
  cancelled: "bg-status-rejected-bg text-status-rejected",
  missed: "bg-status-warning-bg text-status-warning",
};

const queueStyles: Record<QueueStatus, string> = {
  waiting: "bg-status-processing-bg text-status-processing",
  serving: "bg-status-submitted-bg text-status-submitted",
  completed: "bg-status-completed-bg text-status-completed",
  skipped: "bg-status-warning-bg text-status-warning",
  cancelled: "bg-status-rejected-bg text-status-rejected",
};

const requestIcons = {
  submitted: CircleDot,
  under_review: FileSearch,
  processing: Clock,
  ready_for_pickup: PackageCheck,
  completed: CheckCircle2,
  rejected: XCircle,
} as const;

const appointmentIcons = {
  scheduled: CalendarClock,
  checked_in: LogIn,
  completed: CheckCircle2,
  cancelled: Ban,
  missed: AlertCircle,
} as const;

const queueIcons = {
  waiting: Clock,
  serving: Bell,
  completed: CheckCircle2,
  skipped: SkipForward,
  cancelled: Ban,
} as const;

type StatusBadgeProps =
  | { kind: "request"; status: RequestStatus; className?: string }
  | { kind: "appointment"; status: AppointmentStatus; className?: string }
  | { kind: "queue"; status: QueueStatus; className?: string };

export function StatusBadge(props: StatusBadgeProps) {
  const { kind, status, className } = props;

  if (kind === "request") {
    const Icon = requestIcons[status];
    return (
      <Badge
        variant="secondary"
        className={cn("rounded-md border-0", requestStyles[status], className)}
      >
        <Icon aria-hidden />
        {REQUEST_STATUS_LABELS[status]}
      </Badge>
    );
  }

  if (kind === "appointment") {
    const Icon = appointmentIcons[status];
    return (
      <Badge
        variant="secondary"
        className={cn(
          "rounded-md border-0",
          appointmentStyles[status],
          className
        )}
      >
        <Icon aria-hidden />
        {APPOINTMENT_STATUS_LABELS[status]}
      </Badge>
    );
  }

  const Icon = queueIcons[status];

  return (
    <Badge
      variant="secondary"
      className={cn("rounded-md border-0", queueStyles[status], className)}
    >
      <Icon aria-hidden />
      {QUEUE_STATUS_LABELS[status]}
    </Badge>
  );
}
