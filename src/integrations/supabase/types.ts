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
      about_content: {
        Row: {
          content: string
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          section_key: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          section_key: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          section_key?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      about_stats: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          label: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          label: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          label?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      about_timeline: {
        Row: {
          created_at: string | null
          description: string
          display_order: number | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
          year: string
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
          year: string
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
          year?: string
        }
        Relationships: []
      }
      about_values: {
        Row: {
          created_at: string | null
          description: string
          display_order: number | null
          icon: string
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      access_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          id: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      admin_activity_log: {
        Row: {
          action_type: string
          created_at: string
          entity_id: string
          entity_name: string
          entity_type: string
          id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          entity_id: string
          entity_name: string
          entity_type: string
          id?: string
        }
        Update: {
          action_type?: string
          created_at?: string
          entity_id?: string
          entity_name?: string
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          client: string
          cover_image_url: string | null
          created_at: string | null
          description: string
          display_order: number | null
          end_year: string | null
          icon: string
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          location: string
          results: Json | null
          sector: string
          standards: Json | null
          start_year: string | null
          technologies: Json | null
          title: string
          updated_at: string | null
          year: string
        }
        Insert: {
          client: string
          cover_image_url?: string | null
          created_at?: string | null
          description: string
          display_order?: number | null
          end_year?: string | null
          icon?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location: string
          results?: Json | null
          sector: string
          standards?: Json | null
          start_year?: string | null
          technologies?: Json | null
          title: string
          updated_at?: string | null
          year: string
        }
        Update: {
          client?: string
          cover_image_url?: string | null
          created_at?: string | null
          description?: string
          display_order?: number | null
          end_year?: string | null
          icon?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string
          results?: Json | null
          sector?: string
          standards?: Json | null
          start_year?: string | null
          technologies?: Json | null
          title?: string
          updated_at?: string | null
          year?: string
        }
        Relationships: []
      }
      case_study_images: {
        Row: {
          case_study_id: string
          created_at: string | null
          description: string | null
          display_order: number
          id: string
          image_url: string
          updated_at: string | null
        }
        Insert: {
          case_study_id: string
          created_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          updated_at?: string | null
        }
        Update: {
          case_study_id?: string
          created_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_study_images_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string | null
          description: string
          display_order: number | null
          icon: string
          icon_color: string
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number | null
          icon?: string
          icon_color?: string
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number | null
          icon?: string
          icon_color?: string
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client_logos: {
        Row: {
          company_name: string
          created_at: string | null
          display_order: number | null
          icon_fallback: string | null
          id: string
          is_active: boolean | null
          logo_url: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          display_order?: number | null
          icon_fallback?: string | null
          id?: string
          is_active?: boolean | null
          logo_url: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          display_order?: number | null
          icon_fallback?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string
          business_hours: Json
          created_at: string | null
          email: string
          id: string
          map_embed_url: string | null
          map_latitude: number | null
          map_longitude: number | null
          phone: string
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          address: string
          business_hours?: Json
          created_at?: string | null
          email: string
          id?: string
          map_embed_url?: string | null
          map_latitude?: number | null
          map_longitude?: number | null
          phone: string
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          address?: string
          business_hours?: Json
          created_at?: string | null
          email?: string
          id?: string
          map_embed_url?: string | null
          map_latitude?: number | null
          map_longitude?: number | null
          phone?: string
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string
          service_type: string
          status: string
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone: string
          service_type: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          service_type?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      data_export_requests: {
        Row: {
          completed_at: string | null
          download_url: string | null
          expires_at: string | null
          id: string
          requested_at: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          download_url?: string | null
          expires_at?: string | null
          id?: string
          requested_at?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          download_url?: string | null
          expires_at?: string | null
          id?: string
          requested_at?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      home_stats: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon: string
          id: string
          is_active: boolean | null
          label: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          label: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          label?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      legal_document_access_logs: {
        Row: {
          access_type: string
          accessed_at: string | null
          document_id: string | null
          document_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          document_id?: string | null
          document_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          document_id?: string | null
          document_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_document_access_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "legal_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_documents: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          document_type: string
          effective_date: string
          id: string
          is_active: boolean | null
          title: string
          version: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          document_type: string
          effective_date: string
          id?: string
          is_active?: boolean | null
          title: string
          version: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          document_type?: string
          effective_date?: string
          id?: string
          is_active?: boolean | null
          title?: string
          version?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          applications: Json | null
          applications_icon_color: string | null
          category: string
          created_at: string | null
          description: string
          features: Json | null
          features_icon_color: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          standards: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          applications?: Json | null
          applications_icon_color?: string | null
          category: string
          created_at?: string | null
          description: string
          features?: Json | null
          features_icon_color?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          standards?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          applications?: Json | null
          applications_icon_color?: string | null
          category?: string
          created_at?: string | null
          description?: string
          features?: Json | null
          features_icon_color?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          standards?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          client_name: string
          company: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          rating: number
          testimonial: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          client_name: string
          company: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          rating?: number
          testimonial: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          client_name?: string
          company?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          rating?: number
          testimonial?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_legal_consents: {
        Row: {
          consented_at: string | null
          cookie_preferences: Json | null
          document_id: string | null
          document_type: string
          document_version: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          consented_at?: string | null
          cookie_preferences?: Json | null
          document_id?: string | null
          document_type: string
          document_version: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          consented_at?: string | null
          cookie_preferences?: Json | null
          document_id?: string | null
          document_type?: string
          document_version?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_legal_consents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "legal_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          last_verified_at: string | null
          next_verification_at: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_verified_at?: string | null
          next_verification_at?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_verified_at?: string | null
          next_verification_at?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_renew_access_codes: { Args: never; Returns: undefined }
      check_contact_rate_limit: { Args: never; Returns: boolean }
      generate_new_access_code: { Args: never; Returns: undefined }
      get_latest_legal_document: {
        Args: { doc_type: string }
        Returns: {
          content: string
          document_type: string
          effective_date: string
          id: string
          title: string
          version: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_needs_consent: {
        Args: { user_uuid: string }
        Returns: {
          document_type: string
          latest_version: string
          needs_consent: boolean
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
