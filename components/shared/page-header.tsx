import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  actionsClassName?: string;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  actionsClassName,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <h2 className="text-page-title">{title}</h2>
        {description ? <p className="text-body text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? (
        <div
          className={cn(
            "flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center [&>a]:h-10 [&>a]:w-full [&>button]:h-10 [&>button]:w-full sm:[&>a]:h-8 sm:[&>a]:w-auto sm:[&>button]:h-8 sm:[&>button]:w-auto",
            actionsClassName
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
