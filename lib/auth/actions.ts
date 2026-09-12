"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthErrorMessage } from "@/lib/auth/errors";
import { profileSchema, type ProfileValues } from "@/lib/auth/schemas";
import { getAuthContext } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updateStudentProfile(values: ProfileValues) {
  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Check your details and try again." };
  }

  const context = await getAuthContext();

  if (!context || context.profile.role !== "student") {
    return { error: "You must be signed in as a student." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      student_id: parsed.data.studentId,
      phone: parsed.data.phone || null,
    })
    .eq("id", context.userId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: getAuthErrorMessage(error) };
  }

  if (!data) {
    return { error: "We could not update your profile." };
  }

  revalidatePath("/student/profile");
  revalidatePath("/student/dashboard");
  return { ok: true as const };
}
