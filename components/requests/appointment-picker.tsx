import { formatCalendarDate, formatClock } from "@/lib/format/datetime";
import type { AppointmentSlot } from "@/lib/student/request";
import { cn } from "@/lib/utils";

type AppointmentPickerProps = {
  slots: AppointmentSlot[];
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  dateError?: string;
  timeError?: string;
};

function uniqueDates(slots: AppointmentSlot[]): string[] {
  return [...new Set(slots.map((slot) => slot.date))];
}

export function AppointmentPicker({
  slots,
  date,
  time,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}: AppointmentPickerProps) {
  const dates = uniqueDates(slots);
  const times = slots.filter((slot) => slot.date === date);

  if (slots.length === 0) {
    return (
      <p className="rounded-xl border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
        No appointment slots are open in the next two weeks. Try again later.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Appointment date</legend>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
          {dates.map((value) => {
            const selected = date === value;
            const label = formatCalendarDate(value).split(", ");

            return (
              <button
                key={value}
                type="button"
                onClick={() => onDateChange(value)}
                aria-pressed={selected}
                className={cn(
                  "min-h-14 min-w-[5.5rem] shrink-0 rounded-lg border px-3 py-2 text-center transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card hover:border-primary/40"
                )}
              >
                <span className="block text-xs opacity-80">
                  {label[0] ?? value}
                </span>
                <span className="mt-0.5 block text-sm font-medium">
                  {label[1] ?? value}
                </span>
              </button>
            );
          })}
        </div>
        {dateError ? (
          <p className="text-xs text-destructive" role="alert">
            {dateError}
          </p>
        ) : null}
      </fieldset>

      {date ? (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Appointment time</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {times.map((slot) => {
              const selected = time === slot.time;
              const full = slot.remaining <= 0;

              return (
                <button
                  key={`${slot.date}-${slot.time}`}
                  type="button"
                  disabled={full}
                  onClick={() => onTimeChange(slot.time)}
                  aria-pressed={selected}
                  className={cn(
                    "min-h-14 rounded-lg border px-3 py-2 text-left transition-colors",
                    selected &&
                      "border-primary bg-primary text-primary-foreground",
                    !selected &&
                      !full &&
                      "bg-card hover:border-primary/40",
                    full && "cursor-not-allowed opacity-50"
                  )}
                >
                  <span className="block text-sm font-medium">
                    {formatClock(slot.time)}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block text-xs",
                      selected ? "opacity-80" : "text-muted-foreground"
                    )}
                  >
                    {full
                      ? "Unavailable"
                      : `${slot.remaining} of ${slot.capacity} left`}
                  </span>
                </button>
              );
            })}
          </div>
          {timeError ? (
            <p className="text-xs text-destructive" role="alert">
              {timeError}
            </p>
          ) : null}
        </fieldset>
      ) : null}
    </div>
  );
}
