import type { ProfileRow } from "@/lib/supabase/database";

export type AuthProfile = Pick<
  ProfileRow,
  | "id"
  | "student_id"
  | "full_name"
  | "email"
  | "phone"
  | "role"
  | "avatar_url"
>;
