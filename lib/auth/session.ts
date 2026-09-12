import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { homePathForRole } from "@/lib/auth/paths";
import type { AuthProfile } from "@/lib/auth/types";
import { isStaffRole, type AppUser } from "@/lib/roles";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type { AuthProfile };

export type AuthContext = {
  userId: string;
  profile: AuthProfile;
};

export function toAppUser(profile: AuthProfile): AppUser {
  return {
    name: profile.full_name?.trim() || profile.email,
    email: profile.email,
    role: profile.role,
    studentId: profile.student_id ?? undefined,
    avatarUrl: profile.avatar_url,
  };
}

export async function getAuthContext(): Promise<AuthContext | null> {
  if (!getSupabasePublicEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  if (error || !userId) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, student_id, full_name, email, phone, role, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  return { userId, profile };
}

export async function getRequestPathname(): Promise<string> {
  const headerList = await headers();
  const value = headerList.get("x-pathname") ?? "/";
  return value.split("?")[0] || "/";
}

export async function requireAuthContext(): Promise<AuthContext> {
  const context = await getAuthContext();

  if (!context) {
    const pathname = await getRequestPathname();
    const next = pathname === "/" ? "/login" : `/login?next=${encodeURIComponent(pathname)}`;
    redirect(next);
  }

  return context;
}

export async function requireStudentContext(): Promise<AuthContext> {
  const context = await requireAuthContext();

  if (isStaffRole(context.profile.role)) {
    redirect(homePathForRole(context.profile.role));
  }

  if (context.profile.role !== "student") {
    redirect("/unauthorized");
  }

  return context;
}

export async function requireStaffContext(): Promise<AuthContext> {
  const context = await requireAuthContext();

  if (!isStaffRole(context.profile.role)) {
    redirect("/unauthorized");
  }

  return context;
}

export async function redirectIfAuthenticated() {
  const context = await getAuthContext();

  if (context) {
    redirect(homePathForRole(context.profile.role));
  }
}
