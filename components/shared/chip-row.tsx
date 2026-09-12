import { cn } from "@/lib/utils";

type ChipRowProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function ChipRow({ label, children, className }: ChipRowProps) {
  return (
    <nav
      aria-label={label}
      className={cn(
        "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {children}
    </nav>
  );
}
