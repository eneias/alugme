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
      bank_accounts: {
        Row: {
          account: string
          account_type: Database["public"]["Enums"]["bank_account_type"] | null
          agency: string
          bank: string
          created_at: string | null
          holder_cpf: string
          holder_name: string
          id: string
          landlord_id: string
          validated: boolean | null
        }
        Insert: {
          account: string
          account_type?: Database["public"]["Enums"]["bank_account_type"] | null
          agency: string
          bank: string
          created_at?: string | null
          holder_cpf: string
          holder_name: string
          id?: string
          landlord_id: string
          validated?: boolean | null
        }
        Update: {
          account?: string
          account_type?: Database["public"]["Enums"]["bank_account_type"] | null
          agency?: string
          bank?: string
          created_at?: string | null
          holder_cpf?: string
          holder_name?: string
          id?: string
          landlord_id?: string
          validated?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlords"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          image_url: string
          link_url: string | null
          order: number | null
          subtitle: string | null
          title: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          image_url: string
          link_url?: string | null
          order?: number | null
          subtitle?: string | null
          title: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          image_url?: string
          link_url?: string | null
          order?: number | null
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      inspection_photos: {
        Row: {
          description: string | null
          id: string
          inspection_id: string
          room: string | null
          uploaded_at: string | null
          uploaded_by: Database["public"]["Enums"]["uploaded_by_type"] | null
          url: string
        }
        Insert: {
          description?: string | null
          id?: string
          inspection_id: string
          room?: string | null
          uploaded_at?: string | null
          uploaded_by?: Database["public"]["Enums"]["uploaded_by_type"] | null
          url: string
        }
        Update: {
          description?: string | null
          id?: string
          inspection_id?: string
          room?: string | null
          uploaded_at?: string | null
          uploaded_by?: Database["public"]["Enums"]["uploaded_by_type"] | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_photos_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          created_at: string | null
          general_description: string | null
          id: string
          landlord_signed_at: string | null
          landlord_signed_by: string | null
          landlord_signed_ip: string | null
          locked: boolean | null
          observations: string | null
          property_id: string
          status: Database["public"]["Enums"]["inspection_status"] | null
          tenant_signed_at: string | null
          tenant_signed_by: string | null
          tenant_signed_ip: string | null
          type: Database["public"]["Enums"]["inspection_type"]
        }
        Insert: {
          created_at?: string | null
          general_description?: string | null
          id?: string
          landlord_signed_at?: string | null
          landlord_signed_by?: string | null
          landlord_signed_ip?: string | null
          locked?: boolean | null
          observations?: string | null
          property_id: string
          status?: Database["public"]["Enums"]["inspection_status"] | null
          tenant_signed_at?: string | null
          tenant_signed_by?: string | null
          tenant_signed_ip?: string | null
          type: Database["public"]["Enums"]["inspection_type"]
        }
        Update: {
          created_at?: string | null
          general_description?: string | null
          id?: string
          landlord_signed_at?: string | null
          landlord_signed_by?: string | null
          landlord_signed_ip?: string | null
          locked?: boolean | null
          observations?: string | null
          property_id?: string
          status?: Database["public"]["Enums"]["inspection_status"] | null
          tenant_signed_at?: string | null
          tenant_signed_by?: string | null
          tenant_signed_ip?: string | null
          type?: Database["public"]["Enums"]["inspection_type"]
        }
        Relationships: [
          {
            foreignKeyName: "inspections_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      landlords: {
        Row: {
          created_at: string | null
          id: string
          social_contract_accepted: boolean | null
          social_contract_accepted_at: string | null
          user_id: string
          validated: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          social_contract_accepted?: boolean | null
          social_contract_accepted_at?: string | null
          user_id: string
          validated?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          social_contract_accepted?: boolean | null
          social_contract_accepted_at?: string | null
          user_id?: string
          validated?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_access: string | null
          name: string
          phone: string | null
          photo: string | null
          status: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          last_access?: string | null
          name: string
          phone?: string | null
          photo?: string | null
          status?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_access?: string | null
          name?: string
          phone?: string | null
          photo?: string | null
          status?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[] | null
          area: number
          availability:
            | Database["public"]["Enums"]["property_availability"]
            | null
          bank_account_id: string | null
          bathrooms: number
          bedrooms: number
          city: string
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          landlord_id: string | null
          lat: number | null
          lng: number | null
          name: string
          neighborhood: string
          price: number
          rating: number | null
          reviews: number | null
          updated_at: string | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          area?: number
          availability?:
            | Database["public"]["Enums"]["property_availability"]
            | null
          bank_account_id?: string | null
          bathrooms?: number
          bedrooms?: number
          city: string
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          landlord_id?: string | null
          lat?: number | null
          lng?: number | null
          name: string
          neighborhood: string
          price?: number
          rating?: number | null
          reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          area?: number
          availability?:
            | Database["public"]["Enums"]["property_availability"]
            | null
          bank_account_id?: string | null
          bathrooms?: number
          bedrooms?: number
          city?: string
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          landlord_id?: string | null
          lat?: number | null
          lng?: number | null
          name?: string
          neighborhood?: string
          price?: number
          rating?: number | null
          reviews?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rental_contracts: {
        Row: {
          contract_terms: string | null
          created_at: string | null
          duration: number
          end_date: string
          id: string
          landlord_signed_at: string | null
          landlord_signed_by: string | null
          landlord_signed_ip: string | null
          monthly_rent: number
          property_id: string
          rental_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["contract_status"] | null
          tenant_cpf: string | null
          tenant_email: string | null
          tenant_id: string | null
          tenant_name: string
          tenant_phone: string | null
          tenant_signed_at: string | null
          tenant_signed_by: string | null
          tenant_signed_ip: string | null
        }
        Insert: {
          contract_terms?: string | null
          created_at?: string | null
          duration?: number
          end_date: string
          id?: string
          landlord_signed_at?: string | null
          landlord_signed_by?: string | null
          landlord_signed_ip?: string | null
          monthly_rent: number
          property_id: string
          rental_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          tenant_cpf?: string | null
          tenant_email?: string | null
          tenant_id?: string | null
          tenant_name: string
          tenant_phone?: string | null
          tenant_signed_at?: string | null
          tenant_signed_by?: string | null
          tenant_signed_ip?: string | null
        }
        Update: {
          contract_terms?: string | null
          created_at?: string | null
          duration?: number
          end_date?: string
          id?: string
          landlord_signed_at?: string | null
          landlord_signed_by?: string | null
          landlord_signed_ip?: string | null
          monthly_rent?: number
          property_id?: string
          rental_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          tenant_cpf?: string | null
          tenant_email?: string | null
          tenant_id?: string | null
          tenant_name?: string
          tenant_phone?: string | null
          tenant_signed_at?: string | null
          tenant_signed_by?: string | null
          tenant_signed_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_contracts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_contracts_rental_id_fkey"
            columns: ["rental_id"]
            isOneToOne: false
            referencedRelation: "rentals"
            referencedColumns: ["id"]
          },
        ]
      }
      rentals: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          property_id: string
          start_date: string
          status: Database["public"]["Enums"]["contract_status"] | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          property_id: string
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          property_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rentals_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
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
      app_role: "admin" | "locador" | "locatario"
      bank_account_type: "corrente" | "poupanca"
      contract_status: "active" | "completed" | "cancelled"
      inspection_status:
        | "pending_tenant"
        | "pending_landlord"
        | "disputed"
        | "completed"
      inspection_type: "entrada" | "saida"
      property_availability: "available" | "rented" | "maintenance"
      uploaded_by_type: "landlord" | "tenant"
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
      app_role: ["admin", "locador", "locatario"],
      bank_account_type: ["corrente", "poupanca"],
      contract_status: ["active", "completed", "cancelled"],
      inspection_status: [
        "pending_tenant",
        "pending_landlord",
        "disputed",
        "completed",
      ],
      inspection_type: ["entrada", "saida"],
      property_availability: ["available", "rented", "maintenance"],
      uploaded_by_type: ["landlord", "tenant"],
    },
  },
} as const
