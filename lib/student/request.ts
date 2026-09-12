import "server-only";

import {
  formatAppointmentSlot,
  formatProcessingDays,
} from "@/lib/format/datetime";
import type { RequestStatus } from "@/lib/status";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type RequestDocumentType = {
  id: string;
  name: string;
  description: string | null;
  processingDays: number;
  processingLabel: string;
};

export type AppointmentSlot = {
  date: string;
  time: string;
  capacity: number;
  booked: number;
  remaining: number;
};

export type RequestReceipt = {
  id: string;
  requestNumber: string;
  queueNumber: string | null;
  status: RequestStatus;
  documentName: string;
  purpose: string | null;
  appointmentLabel: string | null;
};

type ReceiptRow = {
  id: string;
  request_number: string;
  status: RequestStatus;
  purpose: string | null;
  document_types: { name: string } | { name: string }[] | null;
  appointments: {
    appointment_date: string;
    appointment_time: string;
  } | {
    appointment_date: string;
    appointment_time: string;
  }[] | null;
  queue_entries: {
    queue_number: string;
  } | {
    queue_number: string;
  }[] | null;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getRequestDocumentTypes(): Promise<RequestDocumentType[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("document_types")
    .select("id, name, description, processing_days")
    .eq("is_active", true)
    .order("name");

  if (error) {
    throw new Error(`Unable to load document types: ${error.message}`);
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    processingDays: row.processing_days,
    processingLabel: formatProcessingDays(row.processing_days),
  }));
}

export async function getAvailableAppointmentSlots(): Promise<AppointmentSlot[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc(
    "list_available_appointment_slots",
    {
      p_from: null,
      p_to: null,
    }
  );

  if (error) {
    throw new Error(`Unable to load appointment slots: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    date: row.appointment_date,
    time: row.appointment_time,
    capacity: row.capacity,
    booked: row.booked,
    remaining: row.remaining,
  }));
}

export async function getStudentRequestReceipt(
  requestId: string,
  studentId: string
): Promise<RequestReceipt | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("document_requests")
    .select(
      "id, request_number, status, purpose, document_types(name), appointments(appointment_date, appointment_time), queue_entries(queue_number)"
    )
    .eq("id", requestId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load request: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const row = data as ReceiptRow;
  const documentType = one(row.document_types);
  const appointment = one(row.appointments);
  const queue = one(row.queue_entries);

  return {
    id: row.id,
    requestNumber: row.request_number,
    queueNumber: queue?.queue_number ?? null,
    status: row.status,
    documentName: documentType?.name ?? "Registrar document",
    purpose: row.purpose,
    appointmentLabel: appointment
      ? formatAppointmentSlot(
          appointment.appointment_date,
          appointment.appointment_time
        )
      : null,
  };
}
