// src/integrations/supabase/types.ts
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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      content_library: {
        Row: {
          category: Database["public"]["Enums"]["content_category"]
          created_at: string
          creator_id: string
          id: string
          is_active: boolean | null
          license: Database["public"]["Enums"]["license_type"]
          price: number
          thumbnail_url: string | null
          title: string
          video_url: string
        }
        Insert: {
          category: Database["public"]["Enums"]["content_category"]
          created_at?: string
          creator_id: string
          id?: string
          is_active?: boolean | null
          license?: Database["public"]["Enums"]["license_type"]
          price: number
          thumbnail_url?: string | null
          title: string
          video_url: string
        }
        Update: {
          category?: Database["public"]["Enums"]["content_category"]
          created_at?: string
          creator_id?: string
          id?: string
          is_active?: boolean | null
          license?: Database["public"]["Enums"]["license_type"]
          price?: number
          thumbnail_url?: string | null
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_library_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          brand_id: string
          budget_max: number | null
          budget_min: number | null
          content_type: string | null
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          platform: string | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string
          videos_required: number | null
        }
        Insert: {
          brand_id: string
          budget_max?: number | null
          budget_min?: number | null
          content_type?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          platform?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string
          videos_required?: number | null
        }
        Update: {
          brand_id?: string
          budget_max?: number | null
          budget_min?: number | null
          content_type?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          platform?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string
          videos_required?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: string[] | null
          created_at: string
          id: string
          job_id: string
          sender_id: string
          text: string | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string
          id?: string
          job_id: string
          sender_id: string
          text?: string | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string
          id?: string
          job_id?: string
          sender_id?: string
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      portfolio: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          thumbnail_url: string | null
          video_url: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          video_url: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          categories: Database["public"]["Enums"]["content_category"][] | null
          city: string | null
          company_name: string | null
          contact_name: string | null
          created_at: string
          email: string
          id: string
          industry: string | null
          instagram_link: string | null
          is_banned: boolean | null
          name: string
          price_from: number | null
          rating: number | null
          review_count: number | null
          role: Database["public"]["Enums"]["app_role"]
          tiktok_link: string | null
          updated_at: string
          user_id: string
          username: string | null
          website: string | null
          youtube_link: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          categories?: Database["public"]["Enums"]["content_category"][] | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          instagram_link?: string | null
          is_banned?: boolean | null
          name?: string
          price_from?: number | null
          rating?: number | null
          review_count?: number | null
          role?: Database["public"]["Enums"]["app_role"]
          tiktok_link?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
          website?: string | null
          youtube_link?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          categories?: Database["public"]["Enums"]["content_category"][] | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          instagram_link?: string | null
          is_banned?: boolean | null
          name?: string
          price_from?: number | null
          rating?: number | null
          review_count?: number | null
          role?: Database["public"]["Enums"]["app_role"]
          tiktok_link?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
          website?: string | null
          youtube_link?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string
          creator_id: string
          delivery_time: number | null
          id: string
          job_id: string
          message: string | null
          price_offer: number | null
          status: Database["public"]["Enums"]["proposal_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          delivery_time?: number | null
          id?: string
          job_id: string
          message?: string | null
          price_offer?: number | null
          status?: Database["public"]["Enums"]["proposal_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          delivery_time?: number | null
          id?: string
          job_id?: string
          message?: string | null
          price_offer?: number | null
          status?: Database["public"]["Enums"]["proposal_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          brand_id: string
          comment: string | null
          created_at: string
          creator_id: string
          id: string
          job_id: string
          rating: number
        }
        Insert: {
          brand_id: string
          comment?: string | null
          created_at?: string
          creator_id: string
          id?: string
          job_id: string
          rating: number
        }
        Update: {
          brand_id?: string
          comment?: string | null
          created_at?: string
          creator_id?: string
          id?: string
          job_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          created_at: string
          creator_id: string
          feedback: string | null
          file_url: string
          id: string
          job_id: string
          status: Database["public"]["Enums"]["submission_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          feedback?: string | null
          file_url: string
          id?: string
          job_id: string
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          feedback?: string | null
          file_url?: string
          id?: string
          job_id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "creator" | "brand"
      content_category:
        | "beauty"
        | "fashion"
        | "food"
        | "tech"
        | "lifestyle"
        | "fitness"
        | "education"
        | "travel"
      job_status: "open" | "in_progress" | "completed" | "cancelled"
      license_type: "standard" | "extended" | "exclusive"
      proposal_status: "pending" | "accepted" | "rejected"
      submission_status: "submitted" | "approved" | "revision_requested"
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
      app_role: ["admin", "creator", "brand"],
      content_category: [
        "beauty",
        "fashion",
        "food",
        "tech",
        "lifestyle",
        "fitness",
        "education",
        "travel",
      ],
      job_status: ["open", "in_progress", "completed", "cancelled"],
      license_type: ["standard", "extended", "exclusive"],
      proposal_status: ["pending", "accepted", "rejected"],
      submission_status: ["submitted", "approved", "revision_requested"],
    },
  },
} as const
