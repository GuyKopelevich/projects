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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bake_steps: {
        Row: {
          bake_id: string
          completed: boolean | null
          created_at: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          notes: string | null
          sort_order: number
          start_time: string | null
          step_type: string
          title: string
        }
        Insert: {
          bake_id: string
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          sort_order: number
          start_time?: string | null
          step_type: string
          title: string
        }
        Update: {
          bake_id?: string
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          sort_order?: number
          start_time?: string | null
          step_type?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "bake_steps_bake_id_fkey"
            columns: ["bake_id"]
            isOneToOne: false
            referencedRelation: "bakes"
            referencedColumns: ["id"]
          },
        ]
      }
      bakes: {
        Row: {
          bulk_target_hours: number | null
          cold_retard_hours: number | null
          covered_minutes: number | null
          created_at: string | null
          folds_count: number | null
          id: string
          name: string
          notes: string | null
          oven_temp_c: number | null
          rating: number | null
          recipe_id: string | null
          room_temp_c: number | null
          starter_strength: string | null
          status: string | null
          steam_used: boolean | null
          uncovered_minutes: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bulk_target_hours?: number | null
          cold_retard_hours?: number | null
          covered_minutes?: number | null
          created_at?: string | null
          folds_count?: number | null
          id?: string
          name: string
          notes?: string | null
          oven_temp_c?: number | null
          rating?: number | null
          recipe_id?: string | null
          room_temp_c?: number | null
          starter_strength?: string | null
          status?: string | null
          steam_used?: boolean | null
          uncovered_minutes?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bulk_target_hours?: number | null
          cold_retard_hours?: number | null
          covered_minutes?: number | null
          created_at?: string | null
          folds_count?: number | null
          id?: string
          name?: string
          notes?: string | null
          oven_temp_c?: number | null
          rating?: number | null
          recipe_id?: string | null
          room_temp_c?: number | null
          starter_strength?: string | null
          status?: string | null
          steam_used?: boolean | null
          uncovered_minutes?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bakes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          bake_id: string | null
          created_at: string | null
          id: string
          photo_type: string | null
          url: string
          user_id: string
        }
        Insert: {
          bake_id?: string | null
          created_at?: string | null
          id?: string
          photo_type?: string | null
          url: string
          user_id: string
        }
        Update: {
          bake_id?: string | null
          created_at?: string | null
          id?: string
          photo_type?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_bake_id_fkey"
            columns: ["bake_id"]
            isOneToOne: false
            referencedRelation: "bakes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          preferred_temp_unit: string | null
          preferred_time_format: string | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          preferred_temp_unit?: string | null
          preferred_time_format?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          preferred_temp_unit?: string | null
          preferred_time_format?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recipe_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          recipe_id: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_images_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          flour_breakdown: Json | null
          flour_total_g: number
          id: string
          is_sample: boolean | null
          name: string
          notes: string | null
          salt_g: number
          starter_g: number
          updated_at: string | null
          user_id: string
          water_g: number
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          flour_breakdown?: Json | null
          flour_total_g: number
          id?: string
          is_sample?: boolean | null
          name: string
          notes?: string | null
          salt_g: number
          starter_g: number
          updated_at?: string | null
          user_id: string
          water_g: number
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          flour_breakdown?: Json | null
          flour_total_g?: number
          id?: string
          is_sample?: boolean | null
          name?: string
          notes?: string | null
          salt_g?: number
          starter_g?: number
          updated_at?: string | null
          user_id?: string
          water_g?: number
        }
        Relationships: []
      }
      starter_feeds: {
        Row: {
          created_at: string | null
          fed_at: string | null
          flour_g: number
          height_before_cm: number | null
          height_peak_cm: number | null
          id: string
          notes: string | null
          peak_after_hours: number | null
          ratio: string | null
          temp_c: number | null
          user_id: string
          water_g: number
        }
        Insert: {
          created_at?: string | null
          fed_at?: string | null
          flour_g: number
          height_before_cm?: number | null
          height_peak_cm?: number | null
          id?: string
          notes?: string | null
          peak_after_hours?: number | null
          ratio?: string | null
          temp_c?: number | null
          user_id: string
          water_g: number
        }
        Update: {
          created_at?: string | null
          fed_at?: string | null
          flour_g?: number
          height_before_cm?: number | null
          height_peak_cm?: number | null
          id?: string
          notes?: string | null
          peak_after_hours?: number | null
          ratio?: string | null
          temp_c?: number | null
          user_id?: string
          water_g?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
