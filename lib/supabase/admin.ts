import { createClient } from "@supabase/supabase-js";
import "server-only";

import type { Database } from "@/lib/supabase/database";
import { requireSupabasePublicEnv } from "@/lib/supabase/env";

export function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. This key must stay on the server."
    );
  }

  const { url } = requireSupabasePublicEnv();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
