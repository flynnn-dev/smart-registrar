import { PublicHeader } from "@/components/layout/public-header";
import { getAuthContext } from "@/lib/auth/session";

export default async function AuthLayout({
  children,
}: LayoutProps<"/">) {
  const context = await getAuthContext();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PublicHeader showActions={!context} />
      <main className="flex flex-1 items-center justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
