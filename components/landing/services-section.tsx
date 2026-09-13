import {
  Award,
  FileStack,
  FileText,
  GraduationCap,
  IdCard,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
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

function isCatchAllDocument(name: string): boolean {
  return /^other\b/i.test(name.trim());
}

export function ServicesSection({ documentTypes }: ServicesSectionProps) {
  const featured = documentTypes.filter(
    (documentType) => !isCatchAllDocument(documentType.name)
  );
  const hasCatchAll = featured.length !== documentTypes.length;

  return (
    <section id="services" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <Reveal>
          <p className="text-center text-caption font-medium uppercase tracking-[0.16em]">
            Documents
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-center text-page-title md:text-4xl">
            What you can request
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-body text-muted-foreground">
            Times below are estimates. The office confirms the release date after
            review.
          </p>
        </Reveal>

        {featured.length === 0 ? (
          <Reveal delay={1}>
            <p className="mx-auto mt-12 max-w-xl rounded-2xl border bg-card px-6 py-8 text-center text-sm text-muted-foreground">
              Document types will appear here once the registrar publishes them.
            </p>
          </Reveal>
        ) : (
          <Reveal delay={1}>
            <ul className="mx-auto mt-12 max-w-3xl divide-y overflow-hidden rounded-2xl border bg-card">
              {featured.map((documentType) => {
                const Icon = iconForDocumentName(documentType.name);

                return (
                  <li
                    key={documentType.id}
                    className="flex items-start gap-4 px-5 py-4 motion-safe:transition-colors motion-safe:hover:bg-muted/40"
                  >
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h3 className="text-sm font-semibold tracking-tight">
                          {documentType.name}
                        </h3>
                        <p className="text-caption">
                          About {documentType.processing_days}{" "}
                          {documentType.processing_days === 1 ? "day" : "days"}
                        </p>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {documentType.description ??
                          "Registrar-issued document available by request."}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}

        {hasCatchAll ? (
          <p className="mx-auto mt-4 max-w-3xl text-center text-caption">
            Other registrar certifications can be requested after you sign in.
          </p>
        ) : null}
      </div>
    </section>
  );
}
