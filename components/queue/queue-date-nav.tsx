import Link from "next/link";

import { ChipRow } from "@/components/shared/chip-row";
import { buttonVariants } from "@/components/ui/button";
import { formatCalendarDate, schoolCalendarDate } from "@/lib/format/datetime";
import { cn } from "@/lib/utils";

type QueueDateNavProps = {
  href: "/student/queue" | "/registrar/queue";
  dates: string[];
  current: string;
};

export function QueueDateNav({ href, dates, current }: QueueDateNavProps) {
  const today = schoolCalendarDate();

  return (
    <ChipRow label="Queue dates">
      {dates.map((date) => (
        <Link
          key={date}
          href={`${href}?date=${date}`}
          className={cn(
            buttonVariants({
              variant: current === date ? "default" : "outline",
              size: "sm",
            })
          )}
        >
          {date === today ? "Today" : formatCalendarDate(date)}
        </Link>
      ))}
    </ChipRow>
  );
}
