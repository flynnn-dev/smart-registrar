"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { markAllNotificationsRead } from "@/lib/notifications/actions";

type MarkAllReadButtonProps = {
  disabled?: boolean;
};

export function MarkAllReadButton({
  disabled = false,
}: MarkAllReadButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || pending}
      onClick={() => {
        void (async () => {
          setPending(true);
          const result = await markAllNotificationsRead();
          setPending(false);

          if ("error" in result) {
            toast.error(result.error);
            return;
          }

          toast.success("All notifications marked as read");
          router.refresh();
        })();
      }}
    >
      Mark all as read
    </Button>
  );
}
