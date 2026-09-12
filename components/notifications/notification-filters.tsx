import Link from "next/link";

import { ChipRow } from "@/components/shared/chip-row";
import { buttonVariants } from "@/components/ui/button";
import {
  NOTIFICATION_FILTERS,
  NOTIFICATION_FILTER_LABELS,
  type NotificationFilter,
} from "@/lib/notifications/types";
import { cn } from "@/lib/utils";

type NotificationFiltersProps = {
  href: "/student/notifications" | "/registrar/notifications";
  current: NotificationFilter;
};

export function NotificationFilters({
  href,
  current,
}: NotificationFiltersProps) {
  return (
    <ChipRow label="Notification filters">
      {NOTIFICATION_FILTERS.map((filter) => (
        <Link
          key={filter}
          href={`${href}?filter=${filter}`}
          className={cn(
            buttonVariants({
              variant: current === filter ? "default" : "outline",
              size: "sm",
            })
          )}
        >
          {NOTIFICATION_FILTER_LABELS[filter]}
        </Link>
      ))}
    </ChipRow>
  );
}
