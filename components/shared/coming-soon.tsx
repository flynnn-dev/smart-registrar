import { Clock3 } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

type ComingSoonProps = {
  title: string;
  description: string;
};

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="space-y-8">
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={Clock3}
        title="Coming in a later phase"
        description="This screen is reserved so navigation stays intact while authentication and roles are finished."
      />
    </div>
  );
}
