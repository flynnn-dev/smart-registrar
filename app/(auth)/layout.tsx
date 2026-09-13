import { PublicHeader } from "@/components/layout/public-header";
import { getAuthContext } from "@/lib/auth/session";

export default async function AuthLayout({
  children,
}: LayoutProps<"/">) {
  const context = await getAuthContext();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PublicHeader showActions={!context} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
