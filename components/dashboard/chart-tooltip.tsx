"use client";

type ChartTooltipItem = {
  name?: string;
  value?: number | string;
  color?: string;
};

type ChartTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: ChartTooltipItem[];
};

export function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      {label ? <p className="mb-1 font-medium">{label}</p> : null}
      <ul className="space-y-0.5">
        {payload.map((item) => (
          <li key={String(item.name)} className="flex items-center gap-2">
            {item.color ? (
              <span
                aria-hidden
                className="size-2 rounded-full"
                style={{ background: item.color }}
              />
            ) : null}
            <span>
              {item.name}: {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
