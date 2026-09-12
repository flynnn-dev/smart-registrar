"use server";

import { revalidatePath } from "next/cache";

import { getAuthContext } from "@/lib/auth/session";
import {
  documentRequestSchema,
  type DocumentRequestValues,
} from "@/lib/student/request-schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function toRequestError(message: string): string {
  const known = [
    "Enter a purpose of at least 10 characters.",
    "Purpose is too long.",
    "Notes are too long.",
    "Select a valid document type.",
    "Select an appointment schedule.",
    "Select a future appointment schedule.",
    "That appointment slot is not offered.",
    "This appointment slot is no longer available.",
    "You already have an appointment in that slot.",
    "Only students can submit document requests.",
  ];

  return known.find((item) => message.includes(item))
    ?? "We could not submit your request. Please try again.";
}

export async function createStudentDocumentRequest(
  values: DocumentRequestValues
): Promise<{ requestId: string } | { error: string }> {
  const parsed = documentRequestSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Check your request details and try again." };
  }

  const context = await getAuthContext();

  if (!context || context.profile.role !== "student") {
    return { error: "You must be signed in as a student." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("create_student_document_request", {
    p_document_type_id: parsed.data.documentTypeId,
    p_purpose: parsed.data.purpose,
    p_remarks: parsed.data.remarks || null,
    p_appointment_date: parsed.data.appointmentDate,
    p_appointment_time: parsed.data.appointmentTime,
  });

  if (error) {
    return { error: toRequestError(error.message) };
  }

  const created = data?.[0];

  if (!created) {
    return { error: "We could not submit your request. Please try again." };
  }

  revalidatePath("/student/dashboard");
  revalidatePath("/student/requests");
  revalidatePath("/student/requests/new");
  revalidatePath(`/student/requests/${created.request_id}`);

  return { requestId: created.request_id };
}
