import { NextResponse } from "next/server";

import {
  fallbackPathForAuthType,
  parseEmailOtpType,
  resolveAuthNextPath,
} from "@/lib/auth/paths";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function redirectOrigin(request: Request, origin: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (process.env.NODE_ENV === "development" || !forwardedHost) {
    return origin;
  }

  return `${forwardedProto}://${forwardedHost}`;
}

export async function completeEmailAuth(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = parseEmailOtpType(searchParams.get("type"));
  const next = resolveAuthNextPath(
    searchParams.get("next"),
    fallbackPathForAuthType(type)
  );

  if (searchParams.get("error")) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createSupabaseServerClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${redirectOrigin(request, origin)}${next}`);
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(`${redirectOrigin(request, origin)}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
