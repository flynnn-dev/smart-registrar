import type { PublicDocumentType } from "@/lib/catalog/public";

type ServicesSectionProps = {
  documentTypes: PublicDocumentType[];
};

export function ServicesSection({ documentTypes }: ServicesSectionProps) {
  return (
    <section id="services" className="scroll-mt-20 border-b">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <p className="text-caption font-medium uppercase tracking-[0.16em]">
          Services
        </p>
        <h2 className="mt-2 text-page-title">Available registrar documents</h2>
        <p className="mt-2 max-w-2xl text-body text-muted-foreground">
          Processing times are estimates. The office confirms the exact release
          date after review.
        </p>

        {documentTypes.length === 0 ? (
          <p className="mt-8 rounded-xl border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
            Document types will appear here once the registrar publishes them.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {documentTypes.map((documentType) => (
              <li
                key={documentType.id}
                className="rounded-xl border bg-card p-5"
              >
                <h3 className="text-card-title">{documentType.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {documentType.description ??
                    "Registrar-issued document available by request."}
                </p>
                <p className="mt-4 text-caption">
                  About {documentType.processing_days}{" "}
                  {documentType.processing_days === 1 ? "day" : "days"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
