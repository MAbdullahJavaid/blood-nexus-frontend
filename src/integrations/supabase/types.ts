export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bleeding_records: {
        Row: {
          bag_id: string
          bleeding_date: string
          created_at: string | null
          created_by: string | null
          donor_id: string
          id: string
          remarks: string | null
          technician: string | null
          updated_at: string | null
        }
        Insert: {
          bag_id?: string
          bleeding_date: string
          created_at?: string | null
          created_by?: string | null
          donor_id: string
          id?: string
          remarks?: string | null
          technician?: string | null
          updated_at?: string | null
        }
        Update: {
          bag_id?: string
          bleeding_date?: string
          created_at?: string | null
          created_by?: string | null
          donor_id?: string
          id?: string
          remarks?: string | null
          technician?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bleeding_records_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      blood_inventory: {
        Row: {
          bag_id: string
          blood_group: Database["public"]["Enums"]["blood_group"]
          collection_date: string
          created_at: string | null
          created_by: string | null
          donor_id: string | null
          expiry_date: string
          id: string
          status: Database["public"]["Enums"]["blood_status"] | null
          updated_at: string | null
        }
        Insert: {
          bag_id: string
          blood_group: Database["public"]["Enums"]["blood_group"]
          collection_date: string
          created_at?: string | null
          created_by?: string | null
          donor_id?: string | null
          expiry_date: string
          id?: string
          status?: Database["public"]["Enums"]["blood_status"] | null
          updated_at?: string | null
        }
        Update: {
          bag_id?: string
          blood_group?: Database["public"]["Enums"]["blood_group"]
          collection_date?: string
          created_at?: string | null
          created_by?: string | null
          donor_id?: string | null
          expiry_date?: string
          id?: string
          status?: Database["public"]["Enums"]["blood_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blood_inventory_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      crossmatch: {
        Row: {
          bag_id: string
          created_at: string | null
          created_by: string | null
          id: string
          patient_id: string
          remarks: string | null
          result: string
          technician: string | null
          test_date: string
          updated_at: string | null
        }
        Insert: {
          bag_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          patient_id: string
          remarks?: string | null
          result: string
          technician?: string | null
          test_date: string
          updated_at?: string | null
        }
        Update: {
          bag_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          patient_id?: string
          remarks?: string | null
          result?: string
          technician?: string | null
          test_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crossmatch_bag_id_fkey"
            columns: ["bag_id"]
            isOneToOne: false
            referencedRelation: "blood_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crossmatch_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          address: string | null
          blood_group: Database["public"]["Enums"]["blood_group"]
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          donor_id: string
          email: string | null
          gender: string | null
          id: string
          last_donation_date: string | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          blood_group: Database["public"]["Enums"]["blood_group"]
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          donor_id: string
          email?: string | null
          gender?: string | null
          id?: string
          last_donation_date?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          blood_group?: Database["public"]["Enums"]["blood_group"]
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          donor_id?: string
          email?: string | null
          gender?: string | null
          id?: string
          last_donation_date?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          invoice_id: string
          item_id: string
          item_type: string
          quantity: number
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id: string
          item_id: string
          item_type: string
          quantity: number
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string
          item_id?: string
          item_type?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "patient_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_invoices: {
        Row: {
          amount_received: number | null
          blood_category: string | null
          blood_group: string | null
          blood_group_type: string | null
          bottle_required: number | null
          bottle_unit_type: string | null
          created_at: string | null
          created_by: string | null
          discount_amount: number | null
          ex_donor: string | null
          hospital_name: string | null
          id: string
          invoice_date: string
          invoice_number: string
          patient_age: number | null
          patient_dob: string | null
          patient_gender: string | null
          patient_id: string
          patient_name: string | null
          patient_phone: string | null
          patient_references: string | null
          patient_type: string | null
          remarks: string | null
          rh_type: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount_received?: number | null
          blood_category?: string | null
          blood_group?: string | null
          blood_group_type?: string | null
          bottle_required?: number | null
          bottle_unit_type?: string | null
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          ex_donor?: string | null
          hospital_name?: string | null
          id?: string
          invoice_date: string
          invoice_number: string
          patient_age?: number | null
          patient_dob?: string | null
          patient_gender?: string | null
          patient_id: string
          patient_name?: string | null
          patient_phone?: string | null
          patient_references?: string | null
          patient_type?: string | null
          remarks?: string | null
          rh_type?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          amount_received?: number | null
          blood_category?: string | null
          blood_group?: string | null
          blood_group_type?: string | null
          bottle_required?: number | null
          bottle_unit_type?: string | null
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          ex_donor?: string | null
          hospital_name?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          patient_age?: number | null
          patient_dob?: string | null
          patient_gender?: string | null
          patient_id?: string
          patient_name?: string | null
          patient_phone?: string | null
          patient_references?: string | null
          patient_type?: string | null
          remarks?: string | null
          rh_type?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_invoices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          age: number | null
          blood_group: Database["public"]["Enums"]["blood_group"]
          bottle_quantity: number | null
          bottle_unit_type: string | null
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          email: string | null
          gender: string | null
          hospital: string | null
          id: string
          name: string
          patient_id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          blood_group: Database["public"]["Enums"]["blood_group"]
          bottle_quantity?: number | null
          bottle_unit_type?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          hospital?: string | null
          id?: string
          name: string
          patient_id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          age?: number | null
          blood_group?: Database["public"]["Enums"]["blood_group"]
          bottle_quantity?: number | null
          bottle_unit_type?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          hospital?: string | null
          id?: string
          name?: string
          patient_id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          username?: string | null
        }
        Relationships: []
      }
      test_categories: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      test_information: {
        Row: {
          category_id: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_information_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "test_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_patient_reg_number: {
        Args: { prefix_type: string }
        Returns: string
      }
      get_next_bag_number: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_test_id_by_uuid: {
        Args: { test_id: number } | { test_uuid: string }
        Returns: number
      }
      is_test_active: {
        Args: { test_description: string }
        Returns: boolean
      }
    }
    Enums: {
      blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      blood_status: "Available" | "Reserved" | "Used" | "Expired" | "Discarded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blood_group: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      blood_status: ["Available", "Reserved", "Used", "Expired", "Discarded"],
    },
  },
} as const
