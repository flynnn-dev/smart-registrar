import {
  getSupabaseProjectHost,
  getSupabasePublicEnv,
} from "@/lib/supabase/env";

export type SupabaseConnectionStatus =
  | {
      state: "unconfigured";
    }
  | {
      state: "connected";
      projectHost: string;
      schemaReady: boolean;
      documentTypeCount: number;
    }
  | {
      state: "error";
      projectHost?: string;
      message: string;
    };

export async function getSupabaseConnectionStatus(): Promise<SupabaseConnectionStatus> {
  const env = getSupabasePublicEnv();

  if (!env) {
    return { state: "unconfigured" };
  }

  const projectHost = getSupabaseProjectHost(env.url) ?? undefined;

  if (!projectHost) {
    return {
      state: "error",
      message: "The Supabase URL is not a valid address.",
    };
  }

  try {
    const response = await fetch(`${env.url.replace(/\/$/, "")}/auth/v1/health`, {
      headers: {
        apikey: env.anonKey,
        Authorization: `Bearer ${env.anonKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        state: "error",
        projectHost,
        message: "Could not reach Supabase Auth. Check the project URL and anon key.",
      };
    }

    const schemaResponse = await fetch(
      `${env.url.replace(/\/$/, "")}/rest/v1/document_types?select=id&is_active=eq.true`,
      {
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${env.anonKey}`,
        },
        cache: "no-store",
      }
    );

    return {
      state: "connected",
      projectHost,
      schemaReady: schemaResponse.ok,
      documentTypeCount: schemaResponse.ok
        ? ((await schemaResponse.json()) as unknown[]).length
        : 0,
    };
  } catch {
    return {
      state: "error",
      projectHost,
      message: "Could not reach Supabase. Check the project URL and your network connection.",
    };
  }
}
