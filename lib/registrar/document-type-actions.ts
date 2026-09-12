"use server";

import { revalidatePath } from "next/cache";

import { getAuthContext } from "@/lib/auth/session";
import {
  documentTypeSchema,
  type DocumentTypeValues,
} from "@/lib/registrar/document-type-schema";
import { REQUEST_ID_PATTERN } from "@/lib/requests/types";
import { isStaffRole } from "@/lib/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function revalidateDocumentTypeViews() {
  revalidatePath("/registrar/documents");
  revalidatePath("/registrar/requests");
  revalidatePath("/registrar/dashboard");
  revalidatePath("/student/requests/new");
  revalidatePath("/");
}

function toDocumentTypeError(message: string): string {
  if (
    message.includes("document_types_name_lower_uidx") ||
    message.includes("document_types_name_key")
  ) {
    return "A document type with this name already exists.";
  }

  if (message.includes("document_types_name_not_blank")) {
    return "Enter a document name.";
  }

  if (message.includes("processing_days")) {
    return "Processing time must be between 0 and 60 days.";
  }

  return "We could not save that document type. Please try again.";
}

async function requireStaffUser(): Promise<{ ok: true } | { error: string }> {
  const context = await getAuthContext();

  if (!context || !isStaffRole(context.profile.role)) {
    return { error: "You must be signed in as registrar staff." };
  }

  return { ok: true };
}

function parsedValues(
  input: DocumentTypeValues
):
  | { ok: true; values: {
      name: string;
      description: string | null;
      processing_days: number;
      is_active: boolean;
    } }
  | { error: string } {
  const parsed = documentTypeSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the document details.",
    };
  }

  return {
    ok: true,
    values: {
      name: parsed.data.name,
      description: parsed.data.description?.trim() || null,
      processing_days: parsed.data.processingDays,
      is_active: parsed.data.isActive,
    },
  };
}

export async function createStaffDocumentType(
  input: DocumentTypeValues
): Promise<{ ok: true } | { error: string }> {
  const auth = await requireStaffUser();

  if (!("ok" in auth)) {
    return auth;
  }

  const parsed = parsedValues(input);

  if (!("ok" in parsed)) {
    return parsed;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("document_types").insert(parsed.values);

  if (error) {
    return { error: toDocumentTypeError(error.message) };
  }

  revalidateDocumentTypeViews();
  return { ok: true };
}

export async function updateStaffDocumentType(
  documentTypeId: string,
  input: DocumentTypeValues
): Promise<{ ok: true } | { error: string }> {
  const auth = await requireStaffUser();

  if (!("ok" in auth)) {
    return auth;
  }

  if (!REQUEST_ID_PATTERN.test(documentTypeId)) {
    return { error: "We could not find that document type." };
  }

  const parsed = parsedValues(input);

  if (!("ok" in parsed)) {
    return parsed;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("document_types")
    .update(parsed.values)
    .eq("id", documentTypeId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: toDocumentTypeError(error.message) };
  }

  if (!data) {
    return { error: "We could not find that document type." };
  }

  revalidateDocumentTypeViews();
  return { ok: true };
}

export async function setStaffDocumentTypeActive(
  documentTypeId: string,
  isActive: boolean
): Promise<{ ok: true } | { error: string }> {
  const auth = await requireStaffUser();

  if (!("ok" in auth)) {
    return auth;
  }

  if (!REQUEST_ID_PATTERN.test(documentTypeId)) {
    return { error: "We could not find that document type." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("document_types")
    .update({ is_active: isActive })
    .eq("id", documentTypeId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: toDocumentTypeError(error.message) };
  }

  if (!data) {
    return { error: "We could not find that document type." };
  }

  revalidateDocumentTypeViews();
  return { ok: true };
}
