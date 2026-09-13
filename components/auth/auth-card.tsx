import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <Card className="rounded-2xl shadow-card">
      <CardHeader className="gap-2 px-6 pt-6 sm:px-8 sm:pt-8">
        <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-6">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-6 sm:px-8">{children}</CardContent>
      {footer ? (
        <CardFooter className="justify-center bg-muted/30 px-6 py-4 sm:px-8">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
