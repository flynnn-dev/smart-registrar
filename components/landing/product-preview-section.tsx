import { DashboardPreview } from "@/components/landing/dashboard-preview";

export function ProductPreviewSection() {
  return (
    <section id="preview" className="scroll-mt-20">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-caption font-medium uppercase tracking-[0.16em]">
            Product
          </p>
          <h2 className="mt-3 text-page-title md:text-4xl">
            Everything you need, in one place.
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
            Requests, appointments, queue numbers, status, and notifications
            live on one dashboard — so students always know what to do next.
          </p>
        </div>
        <div className="overflow-hidden rounded-[1.75rem] bg-muted/70 p-2 ring-1 ring-border">
          <DashboardPreview variant="full" className="border-0 shadow-none" />
        </div>
      </div>
    </section>
  );
}
