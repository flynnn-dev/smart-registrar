import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/landing/public-footer";

type LegalPageProps = {
  title: string;
  updated: string;
  children: React.ReactNode;
};

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PublicHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 md:px-6 md:py-16">
        <p className="text-caption">Last updated {updated}</p>
        <h1 className="mt-2 text-page-title">{title}</h1>
        <div className="mt-6 space-y-4 text-body text-muted-foreground">
          {children}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
