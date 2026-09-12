"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type QueueLiveSyncProps = {
  date: string;
};

export function QueueLiveSync({ date }: QueueLiveSyncProps) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let cancelled = false;
    let refreshTimer: number | undefined;

    function refresh() {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        if (!cancelled && document.visibilityState === "visible") {
          router.refresh();
        }
      }, 150);
    }

    void supabase.realtime.setAuth();

    const channel = supabase
      .channel("queue", { config: { private: true } })
      .on("broadcast", { event: "queue_changed" }, (message) => {
        const changedDate = (message.payload as { date?: string } | undefined)
          ?.date;

        if (!changedDate || changedDate === date) {
          refresh();
        }
      })
      .subscribe();

    const pollTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }, 4_000);

    function onVisible() {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearTimeout(refreshTimer);
      window.clearInterval(pollTimer);
      document.removeEventListener("visibilitychange", onVisible);
      void supabase.removeChannel(channel);
    };
  }, [date, router]);

  return null;
}
