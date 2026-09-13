import {
  Award,
  FileStack,
  FileText,
  GraduationCap,
  IdCard,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import type { PublicDocumentType } from "@/lib/catalog/public";

type ServicesSectionProps = {
  documentTypes: PublicDocumentType[];
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

  if (key.includes("good moral") || key.includes("moral")) {
    return ShieldCheck;
  }

  if (key.includes("diploma")) {
    return Award;
  }

  return FileStack;
}

export function ServicesSection({ documentTypes }: ServicesSectionProps) {
  return (
    <section id="services" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <p className="text-center text-caption font-medium uppercase tracking-[0.16em]">
          Services
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-page-title md:text-4xl">
          Available registrar documents
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-body text-muted-foreground">
          Processing times are estimates. The office confirms the exact release
          date after review.
        </p>

        {documentTypes.length === 0 ? (
          <p className="landing-feature-card mx-auto mt-12 max-w-xl text-center text-sm text-muted-foreground">
            Document types will appear here once the registrar publishes them.
          </p>
        ) : (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {documentTypes.map((documentType) => {
              const Icon = iconForDocumentName(documentType.name);

              return (
                <li key={documentType.id} className="landing-feature-card">
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">
                    {documentType.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {documentType.description ??
                      "Registrar-issued document available by request."}
                  </p>
                  <p className="mt-4 text-caption">
                    About {documentType.processing_days}{" "}
                    {documentType.processing_days === 1 ? "day" : "days"}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
