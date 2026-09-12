import { Badge } from "@/components/ui/badge";
import {
  STUDENT_ACCOUNT_STATUS_LABELS,
  type StudentAccountStatus,
} from "@/lib/registrar/student-types";
import { cn } from "@/lib/utils";

type AccountStatusBadgeProps = {
  status: StudentAccountStatus;
  className?: string;
};

export function AccountStatusBadge({
  status,
  className,
}: AccountStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-md border-0",
        status === "active"
          ? "bg-status-completed-bg text-status-completed"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      {STUDENT_ACCOUNT_STATUS_LABELS[status]}
    </Badge>
  );
}
