export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string;
          appointment_time: string;
          created_at: string;
          id: string;
          notes: string | null;
          status: Database["public"]["Enums"]["appointment_status"];
          student_id: string;
          updated_at: string;
        };
        Insert: {
          appointment_date: string;
          appointment_time: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["appointment_status"];
          student_id: string;
          updated_at?: string;
        };
        Update: {
          appointment_date?: string;
          appointment_time?: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["appointment_status"];
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      document_requests: {
        Row: {
          appointment_id: string | null;
          completed_at: string | null;
          created_at: string;
          document_type_id: string;
          id: string;
          purpose: string | null;
          remarks: string | null;
          request_number: string;
          status: Database["public"]["Enums"]["request_status"];
          student_id: string;
          submitted_at: string;
          updated_at: string;
        };
        Insert: {
          appointment_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          document_type_id: string;
          id?: string;
          purpose?: string | null;
          remarks?: string | null;
          request_number?: string;
          status?: Database["public"]["Enums"]["request_status"];
          student_id: string;
          submitted_at?: string;
          updated_at?: string;
        };
        Update: {
          appointment_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          document_type_id?: string;
          id?: string;
          purpose?: string | null;
          remarks?: string | null;
          request_number?: string;
          status?: Database["public"]["Enums"]["request_status"];
          student_id?: string;
          submitted_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "document_requests_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_requests_document_type_id_fkey";
            columns: ["document_type_id"];
            isOneToOne: false;
            referencedRelation: "document_types";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_requests_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      document_types: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          processing_days: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          processing_days?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          processing_days?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          created_at: string;
          id: string;
          is_read: boolean;
          message: string;
          request_id: string | null;
          title: string;
          type: Database["public"]["Enums"]["notification_type"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_read?: boolean;
          message: string;
          request_id?: string | null;
          title: string;
          type?: Database["public"]["Enums"]["notification_type"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_read?: boolean;
          message?: string;
          request_id?: string | null;
          title?: string;
          type?: Database["public"]["Enums"]["notification_type"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "document_requests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      operating_hours: {
        Row: {
          created_at: string;
          day_of_week: number;
          end_time: string;
          id: string;
          is_active: boolean;
          max_per_slot: number;
          slot_minutes: number;
          start_time: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          day_of_week: number;
          end_time: string;
          id?: string;
          is_active?: boolean;
          max_per_slot?: number;
          slot_minutes?: number;
          start_time: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          day_of_week?: number;
          end_time?: string;
          id?: string;
          is_active?: boolean;
          max_per_slot?: number;
          slot_minutes?: number;
          start_time?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          phone: string | null;
          role: Database["public"]["Enums"]["app_role"];
          student_id: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          student_id?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          student_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      queue_entries: {
        Row: {
          called_at: string | null;
          completed_at: string | null;
          created_at: string;
          id: string;
          queue_date: string;
          queue_number: string;
          request_id: string;
          status: Database["public"]["Enums"]["queue_status"];
        };
        Insert: {
          called_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          queue_date: string;
          queue_number?: string;
          request_id: string;
          status?: Database["public"]["Enums"]["queue_status"];
        };
        Update: {
          called_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          queue_date?: string;
          queue_number?: string;
          request_id?: string;
          status?: Database["public"]["Enums"]["queue_status"];
        };
        Relationships: [
          {
            foreignKeyName: "queue_entries_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "document_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      request_status_history: {
        Row: {
          changed_by: string | null;
          created_at: string;
          id: string;
          new_status: Database["public"]["Enums"]["request_status"];
          old_status: Database["public"]["Enums"]["request_status"] | null;
          remarks: string | null;
          request_id: string;
        };
        Insert: {
          changed_by?: string | null;
          created_at?: string;
          id?: string;
          new_status: Database["public"]["Enums"]["request_status"];
          old_status?: Database["public"]["Enums"]["request_status"] | null;
          remarks?: string | null;
          request_id: string;
        };
        Update: {
          changed_by?: string | null;
          created_at?: string;
          id?: string;
          new_status?: Database["public"]["Enums"]["request_status"];
          old_status?: Database["public"]["Enums"]["request_status"] | null;
          remarks?: string | null;
          request_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "request_status_history_changed_by_fkey";
            columns: ["changed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "request_status_history_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "document_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      system_settings: {
        Row: {
          key: string;
          updated_at: string;
          updated_by: string | null;
          value: Json;
        };
        Insert: {
          key: string;
          updated_at?: string;
          updated_by?: string | null;
          value: Json;
        };
        Update: {
          key?: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      transaction_records: {
        Row: {
          action: string;
          created_at: string;
          id: string;
          performed_by: string | null;
          remarks: string | null;
          request_id: string | null;
          student_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          id?: string;
          performed_by?: string | null;
          remarks?: string | null;
          request_id?: string | null;
          student_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          id?: string;
          performed_by?: string | null;
          remarks?: string | null;
          request_id?: string | null;
          student_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "transaction_records_performed_by_fkey";
            columns: ["performed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transaction_records_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "document_requests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transaction_records_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      call_next_queue_entry: {
        Args: {
          p_date: string;
        };
        Returns: {
          id: string;
          queue_number: string;
          request_id: string;
          status: Database["public"]["Enums"]["queue_status"];
        }[];
      };
      create_student_document_request: {
        Args: {
          p_appointment_date: string;
          p_appointment_time: string;
          p_document_type_id: string;
          p_purpose: string;
          p_remarks?: string | null;
        };
        Returns: {
          appointment_date: string;
          appointment_time: string;
          document_name: string;
          queue_number: string | null;
          request_id: string;
          request_number: string;
          status: Database["public"]["Enums"]["request_status"];
        }[];
      };
      get_queue_board: {
        Args: {
          p_date: string;
        };
        Returns: {
          cancelled_count: number;
          completed_count: number;
          estimated_minutes_per_ticket: number;
          estimated_wait_minutes: number | null;
          next_numbers: string[];
          people_ahead: number | null;
          serving_count: number;
          serving_number: string | null;
          skipped_count: number;
          waiting_count: number;
          your_number: string | null;
          your_status: Database["public"]["Enums"]["queue_status"] | null;
        }[];
      };
      is_student_id_available: {
        Args: {
          p_student_id: string;
        };
        Returns: boolean;
      };
      list_available_appointment_slots: {
        Args: {
          p_from?: string | null;
          p_to?: string | null;
        };
        Returns: {
          appointment_date: string;
          appointment_time: string;
          booked: number;
          capacity: number;
          remaining: number;
        }[];
      };
    };
    Enums: {
      app_role: "student" | "registrar" | "admin";
      appointment_status:
        | "scheduled"
        | "checked_in"
        | "completed"
        | "cancelled"
        | "missed";
      notification_type:
        | "request_update"
        | "ready_for_pickup"
        | "appointment"
        | "system";
      queue_status:
        | "waiting"
        | "serving"
        | "completed"
        | "skipped"
        | "cancelled";
      request_status:
        | "submitted"
        | "under_review"
        | "processing"
        | "ready_for_pickup"
        | "completed"
        | "rejected";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type AppRole = Database["public"]["Enums"]["app_role"];
export type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];
export type DocumentRequestRow =
  Database["public"]["Tables"]["document_requests"]["Row"];
export type DocumentTypeRow =
  Database["public"]["Tables"]["document_types"]["Row"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type QueueEntryRow = Database["public"]["Tables"]["queue_entries"]["Row"];
