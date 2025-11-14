export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_configurations: {
        Row: {
          business_context: string | null
          created_at: string
          customer_id: string
          faqs: Json | null
          greeting: string | null
          id: string
          memory_settings: Json | null
          personality: string | null
          scheduling_rules: Json | null
          tone: string | null
          updated_at: string
          voice_pipeline: Json | null
        }
        Insert: {
          business_context?: string | null
          created_at?: string
          customer_id: string
          faqs?: Json | null
          greeting?: string | null
          id?: string
          memory_settings?: Json | null
          personality?: string | null
          scheduling_rules?: Json | null
          tone?: string | null
          updated_at?: string
          voice_pipeline?: Json | null
        }
        Update: {
          business_context?: string | null
          created_at?: string
          customer_id?: string
          faqs?: Json | null
          greeting?: string | null
          id?: string
          memory_settings?: Json | null
          personality?: string | null
          scheduling_rules?: Json | null
          tone?: string | null
          updated_at?: string
          voice_pipeline?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_configurations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          appointment_date: string
          appointment_time: string
          call_id: string | null
          created_at: string
          customer_email: string | null
          customer_id: string
          customer_name: string
          customer_phone: string
          id: string
          notes: string | null
          service: string | null
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          call_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id: string
          customer_name: string
          customer_phone: string
          id?: string
          notes?: string | null
          service?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          call_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          notes?: string | null
          service?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          schedule: Json
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          schedule?: Json
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          schedule?: Json
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      call_events: {
        Row: {
          call_id: string
          created_at: string
          customer_id: string
          event_data: Json | null
          event_type: string
          id: string
        }
        Insert: {
          call_id: string
          created_at?: string
          customer_id: string
          event_data?: Json | null
          event_type: string
          id?: string
        }
        Update: {
          call_id?: string
          created_at?: string
          customer_id?: string
          event_data?: Json | null
          event_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_events_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      call_metrics: {
        Row: {
          asr_latency_ms: number | null
          barge_in_count: number | null
          call_id: string
          confidence_score: number | null
          created_at: string | null
          customer_id: string
          escalated_to_human: boolean | null
          escalation_reason: string | null
          id: string
          intent_name: string | null
          intent_recognized: boolean | null
          invalid_attempts: number | null
          llm_latency_ms: number | null
          pipeline_config: Json | null
          rag_score: number | null
          total_latency_ms: number | null
          tts_latency_ms: number | null
        }
        Insert: {
          asr_latency_ms?: number | null
          barge_in_count?: number | null
          call_id: string
          confidence_score?: number | null
          created_at?: string | null
          customer_id: string
          escalated_to_human?: boolean | null
          escalation_reason?: string | null
          id?: string
          intent_name?: string | null
          intent_recognized?: boolean | null
          invalid_attempts?: number | null
          llm_latency_ms?: number | null
          pipeline_config?: Json | null
          rag_score?: number | null
          total_latency_ms?: number | null
          tts_latency_ms?: number | null
        }
        Update: {
          asr_latency_ms?: number | null
          barge_in_count?: number | null
          call_id?: string
          confidence_score?: number | null
          created_at?: string | null
          customer_id?: string
          escalated_to_human?: boolean | null
          escalation_reason?: string | null
          id?: string
          intent_name?: string | null
          intent_recognized?: boolean | null
          invalid_attempts?: number | null
          llm_latency_ms?: number | null
          pipeline_config?: Json | null
          rag_score?: number | null
          total_latency_ms?: number | null
          tts_latency_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "call_metrics_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_metrics_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          conversation_id: string | null
          created_at: string
          customer_id: string | null
          duration_sec: number | null
          ended_at: string | null
          forwarded_from: string | null
          id: string
          intent: string | null
          phone_number: string
          sentiment: string | null
          started_at: string
          status: string
          transcript: string | null
          twilio_call_sid: string | null
          updated_at: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          customer_id?: string | null
          duration_sec?: number | null
          ended_at?: string | null
          forwarded_from?: string | null
          id?: string
          intent?: string | null
          phone_number: string
          sentiment?: string | null
          started_at?: string
          status?: string
          transcript?: string | null
          twilio_call_sid?: string | null
          updated_at?: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          customer_id?: string | null
          duration_sec?: number | null
          ended_at?: string | null
          forwarded_from?: string | null
          id?: string
          intent?: string | null
          phone_number?: string
          sentiment?: string | null
          started_at?: string
          status?: string
          transcript?: string | null
          twilio_call_sid?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string
          customer_id: string
          email: string | null
          id: string
          metadata: Json | null
          name: string | null
          phone_number: string | null
          updated_at: string
          whatsapp_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          phone_number?: string | null
          updated_at?: string
          whatsapp_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          phone_number?: string | null
          updated_at?: string
          whatsapp_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          channel: string
          contact_id: string
          created_at: string
          customer_id: string
          id: string
          metadata: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          channel: string
          contact_id: string
          created_at?: string
          customer_id: string
          id?: string
          metadata?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          channel?: string
          contact_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          metadata?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      credits_usage: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          description: string | null
          id: string
          usage_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          description?: string | null
          id?: string
          usage_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          description?: string | null
          id?: string
          usage_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_usage_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          business_email: string | null
          business_name: string
          business_phone: string | null
          created_at: string
          id: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          business_email?: string | null
          business_name: string
          business_phone?: string | null
          created_at?: string
          id?: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          business_email?: string | null
          business_name?: string
          business_phone?: string | null
          created_at?: string
          id?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      intent_schemas: {
        Row: {
          confidence_threshold: number | null
          created_at: string | null
          customer_id: string
          description: string | null
          fallback_action: string | null
          id: string
          intent_name: string
          is_active: boolean | null
          priority: number | null
          schema: Json
          updated_at: string | null
          validation_rules: Json | null
        }
        Insert: {
          confidence_threshold?: number | null
          created_at?: string | null
          customer_id: string
          description?: string | null
          fallback_action?: string | null
          id?: string
          intent_name: string
          is_active?: boolean | null
          priority?: number | null
          schema: Json
          updated_at?: string | null
          validation_rules?: Json | null
        }
        Update: {
          confidence_threshold?: number | null
          created_at?: string | null
          customer_id?: string
          description?: string | null
          fallback_action?: string | null
          id?: string
          intent_name?: string
          is_active?: boolean | null
          priority?: number | null
          schema?: Json
          updated_at?: string | null
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "intent_schemas_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_documents: {
        Row: {
          category: string | null
          chunk_index: number | null
          content: string
          created_at: string
          customer_id: string
          file_path: string | null
          id: string
          is_active: boolean
          is_chunk: boolean | null
          last_used_at: string | null
          metadata: Json | null
          parent_document_id: string | null
          source_type: string | null
          source_url: string | null
          title: string
          updated_at: string
          usage_count: number | null
          version: number
        }
        Insert: {
          category?: string | null
          chunk_index?: number | null
          content: string
          created_at?: string
          customer_id: string
          file_path?: string | null
          id?: string
          is_active?: boolean
          is_chunk?: boolean | null
          last_used_at?: string | null
          metadata?: Json | null
          parent_document_id?: string | null
          source_type?: string | null
          source_url?: string | null
          title: string
          updated_at?: string
          usage_count?: number | null
          version?: number
        }
        Update: {
          category?: string | null
          chunk_index?: number | null
          content?: string
          created_at?: string
          customer_id?: string
          file_path?: string | null
          id?: string
          is_active?: boolean
          is_chunk?: boolean | null
          last_used_at?: string | null
          metadata?: Json | null
          parent_document_id?: string | null
          source_type?: string | null
          source_url?: string | null
          title?: string
          updated_at?: string
          usage_count?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "kb_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kb_documents_parent_document_id_fkey"
            columns: ["parent_document_id"]
            isOneToOne: false
            referencedRelation: "kb_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          customer_id: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          customer_id: string
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          completed_steps: Json | null
          created_at: string | null
          current_step: number | null
          customer_id: string
          id: string
          is_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          completed_steps?: Json | null
          created_at?: string | null
          current_step?: number | null
          customer_id: string
          id?: string
          is_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          completed_steps?: Json | null
          created_at?: string | null
          current_step?: number | null
          customer_id?: string
          id?: string
          is_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_numbers: {
        Row: {
          business_phone_number: string | null
          created_at: string
          customer_id: string
          forwarding_instructions: Json | null
          forwarding_verified: boolean | null
          id: string
          phone_number: string
          settings: Json | null
          setup_method: string | null
          status: string
          twilio_sid: string | null
          updated_at: string
        }
        Insert: {
          business_phone_number?: string | null
          created_at?: string
          customer_id: string
          forwarding_instructions?: Json | null
          forwarding_verified?: boolean | null
          id?: string
          phone_number: string
          settings?: Json | null
          setup_method?: string | null
          status?: string
          twilio_sid?: string | null
          updated_at?: string
        }
        Update: {
          business_phone_number?: string | null
          created_at?: string
          customer_id?: string
          forwarding_instructions?: Json | null
          forwarding_verified?: boolean | null
          id?: string
          phone_number?: string
          settings?: Json | null
          setup_method?: string | null
          status?: string
          twilio_sid?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "phone_numbers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          customer_id: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          currency: string | null
          customer_id: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          metadata: Json | null
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          customer_id: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          customer_id?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      transcripts: {
        Row: {
          call_id: string
          created_at: string
          customer_id: string
          full_text: string | null
          id: string
          segments: Json | null
        }
        Insert: {
          call_id: string
          created_at?: string
          customer_id: string
          full_text?: string | null
          id?: string
          segments?: Json | null
        }
        Update: {
          call_id?: string
          created_at?: string
          customer_id?: string
          full_text?: string | null
          id?: string
          segments?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "transcripts_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcripts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_customer_id: { Args: { _user_id: string }; Returns: string }
      has_customer_role: {
        Args: {
          _customer_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "agent" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "agent", "viewer"],
    },
  },
} as const
