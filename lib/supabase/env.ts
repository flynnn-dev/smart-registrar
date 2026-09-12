export type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

function readNonEmpty(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = readNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = readNonEmpty(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function requireSupabasePublicEnv(): SupabasePublicEnv {
  const env = getSupabasePublicEnv();

  if (!env) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
    );
  }

  return env;
}

export function getSupabaseProjectHost(url: string): string | null {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}
