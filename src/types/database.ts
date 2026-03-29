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
      affiliation_translations: {
        Row: {
          affiliation_id: string
          created_at: string
          locale: string
          name: string
          updated_at: string
        }
        Insert: {
          affiliation_id?: string
          created_at?: string
          locale: string
          name: string
          updated_at?: string
        }
        Update: {
          affiliation_id?: string
          created_at?: string
          locale?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliation_translations_affiliation_id_fkey"
            columns: ["affiliation_id"]
            isOneToOne: false
            referencedRelation: "affiliations"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliations: {
        Row: {
          created_at: string
          id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      attribute_translations: {
        Row: {
          attribute_id: string
          created_at: string
          locale: string
          name: string
          updated_at: string
        }
        Insert: {
          attribute_id?: string
          created_at?: string
          locale: string
          name: string
          updated_at?: string
        }
        Update: {
          attribute_id?: string
          created_at?: string
          locale?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attribute_translations_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "attributes"
            referencedColumns: ["id"]
          },
        ]
      }
      attributes: {
        Row: {
          created_at: string
          id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      character_affiliations: {
        Row: {
          affiliation_id: string
          character_id: string
        }
        Insert: {
          affiliation_id?: string
          character_id?: string
        }
        Update: {
          affiliation_id?: string
          character_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_affiliations_affiliation_id_fkey"
            columns: ["affiliation_id"]
            isOneToOne: false
            referencedRelation: "affiliations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_affiliations_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_attributes: {
        Row: {
          attribute_id: string
          character_id: string
        }
        Insert: {
          attribute_id?: string
          character_id?: string
        }
        Update: {
          attribute_id?: string
          character_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_attributes_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_attributes_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_races: {
        Row: {
          character_id: string
          race_id: string
        }
        Insert: {
          character_id?: string
          race_id?: string
        }
        Update: {
          character_id?: string
          race_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_races_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_races_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      character_translations: {
        Row: {
          character_id: string
          created_at: string
          locale: string
          name: string
          search_vector: unknown
          updated_at: string
        }
        Insert: {
          character_id?: string
          created_at?: string
          locale: string
          name: string
          search_vector?: unknown
          updated_at?: string
        }
        Update: {
          character_id?: string
          created_at?: string
          locale?: string
          name?: string
          search_vector?: unknown
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_translations_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          created_at: string
          gender_id: string
          has_transformations: boolean
          id: string
          image_path: string | null
          saga_id: string
          serie_id: string
          silhouette_path: string | null
          slug: string
          thumb_path: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          gender_id?: string
          has_transformations: boolean
          id?: string
          image_path?: string | null
          saga_id?: string
          serie_id?: string
          silhouette_path?: string | null
          slug: string
          thumb_path?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          gender_id?: string
          has_transformations?: boolean
          id?: string
          image_path?: string | null
          saga_id?: string
          serie_id?: string
          silhouette_path?: string | null
          slug?: string
          thumb_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_gender_id_fkey"
            columns: ["gender_id"]
            isOneToOne: false
            referencedRelation: "genders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "characters_saga_id_fkey"
            columns: ["saga_id"]
            isOneToOne: false
            referencedRelation: "sagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "characters_serie_id_fkey"
            columns: ["serie_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      gender_translations: {
        Row: {
          created_at: string
          gender_id: string
          locale: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          gender_id?: string
          locale: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          gender_id?: string
          locale?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gender_translations_gender_id_fkey"
            columns: ["gender_id"]
            isOneToOne: false
            referencedRelation: "genders"
            referencedColumns: ["id"]
          },
        ]
      }
      genders: {
        Row: {
          created_at: string
          id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      race_translations: {
        Row: {
          created_at: string
          locale: string
          name: string
          race_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          locale: string
          name: string
          race_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          locale?: string
          name?: string
          race_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "race_translations_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      races: {
        Row: {
          created_at: string
          id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      saga_translations: {
        Row: {
          created_at: string
          locale: string
          name: string
          saga_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          locale: string
          name: string
          saga_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          locale?: string
          name?: string
          saga_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saga_translations_saga_id_fkey"
            columns: ["saga_id"]
            isOneToOne: false
            referencedRelation: "sagas"
            referencedColumns: ["id"]
          },
        ]
      }
      sagas: {
        Row: {
          created_at: string
          id: string
          slug: string
          sort_order: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          slug: string
          sort_order: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          slug?: string
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      serie_translations: {
        Row: {
          created_at: string
          locale: string
          name: string
          serie_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          locale: string
          name: string
          serie_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          locale?: string
          name?: string
          serie_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "serie_translations_serie_id_fkey"
            columns: ["serie_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      series: {
        Row: {
          created_at: string
          id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      wins: {
        Row: {
          game_date: string
          id: string
          wins_count: number
        }
        Insert: {
          game_date?: string
          id?: string
          wins_count?: number
        }
        Update: {
          game_date?: string
          id?: string
          wins_count?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_character_with_translations: {
        Args: { p_locale: string; p_slug: string }
        Returns: Json
      }
      increment_wins: { Args: { date: string }; Returns: number }
      search_characters: {
        Args: { loc: string; query: string }
        Returns: {
          name: string
          slug: string
          thumb_path: string
        }[]
      }
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
