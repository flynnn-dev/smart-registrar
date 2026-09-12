import {
  Award,
  FileText,
  GraduationCap,
  HeartHandshake,
  IdCard,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

import type { RequestDocumentType } from "@/lib/student/request";
import { cn } from "@/lib/utils";

type DocumentTypeCardsProps = {
  documentTypes: RequestDocumentType[];
  value: string;
  onChange: (id: string) => void;
  error?: string;
};

function iconForDocumentName(name: string): LucideIcon {
  const key = name.toLowerCase();

  if (key.includes("transcript")) {
    return FileText;
  }

  if (key.includes("enrollment")) {
    return IdCard;
  }

  if (key.includes("grade")) {
    return GraduationCap;
  }

  if (key.includes("moral")) {
    return HeartHandshake;
  }

  if (key.includes("diploma")) {
    return Award;
  }

  return ScrollText;
}

export function DocumentTypeCards({
  documentTypes,
  value,
  onChange,
  error,
}: DocumentTypeCardsProps) {
  if (documentTypes.length === 0) {
    return (
      <p className="rounded-xl border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
        The registrar has not published document types yet.
      </p>
    );
  }

  return (
    <div className="space-y-3" role="group" aria-label="Document type">
      <div className="grid gap-3 sm:grid-cols-2">
        {documentTypes.map((documentType) => {
          const Icon = iconForDocumentName(documentType.name);
          const selected = value === documentType.id;

          return (
            <button
              key={documentType.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(documentType.id)}
              className={cn(
                "flex gap-3 rounded-xl border bg-card p-4 text-left transition-colors",
                selected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "hover:border-primary/40"
              )}
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted/60 text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">
                  {documentType.name}
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {documentType.description ??
                    "Registrar-issued document available by request."}
                </span>
                <span className="mt-2 block text-caption">
                  {documentType.processingLabel}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
