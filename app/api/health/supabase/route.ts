import { NextResponse } from "next/server";

import { getSupabaseConnectionStatus } from "@/lib/supabase/health";

export async function GET() {
  const status = await getSupabaseConnectionStatus();

  if (status.state === "connected") {
    return NextResponse.json(status);
  }

  if (status.state === "unconfigured") {
    return NextResponse.json(status, { status: 503 });
  }

  return NextResponse.json(status, { status: 502 });
}
