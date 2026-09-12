import Link from "next/link";

import { ChipRow } from "@/components/shared/chip-row";
import { buttonVariants } from "@/components/ui/button";
import {
  APPOINTMENT_FILTERS,
  APPOINTMENT_FILTER_LABELS,
  type AppointmentFilter,
} from "@/lib/appointments/types";
import { cn } from "@/lib/utils";

type AppointmentFiltersProps = {
  current: AppointmentFilter;
};

export function AppointmentFilters({ current }: AppointmentFiltersProps) {
  return (
    <ChipRow label="Appointment filters">
      {APPOINTMENT_FILTERS.map((filter) => (
        <Link
          key={filter}
          href={`/registrar/appointments?filter=${filter}`}
          className={cn(
            buttonVariants({
              variant: current === filter ? "default" : "outline",
              size: "sm",
            })
          )}
        >
          {APPOINTMENT_FILTER_LABELS[filter]}
        </Link>
      ))}
    </ChipRow>
  );
}
