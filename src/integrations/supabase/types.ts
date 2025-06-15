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
          bag_type: string | null
          bleeding_date: string
          created_at: string | null
          created_by: string | null
          donor_category: string | null
          donor_id: string
          hb: number | null
          hbsag: number | null
          hcv: number | null
          hiv: number | null
          id: string
          remarks: string | null
          technician: string | null
          updated_at: string | null
          vdrl: number | null
        }
        Insert: {
          bag_id?: string
          bag_type?: string | null
          bleeding_date: string
          created_at?: string | null
          created_by?: string | null
          donor_category?: string | null
          donor_id: string
          hb?: number | null
          hbsag?: number | null
          hcv?: number | null
          hiv?: number | null
          id?: string
          remarks?: string | null
          technician?: string | null
          updated_at?: string | null
          vdrl?: number | null
        }
        Update: {
          bag_id?: string
          bag_type?: string | null
          bleeding_date?: string
          created_at?: string | null
          created_by?: string | null
          donor_category?: string | null
          donor_id?: string
          hb?: number | null
          hbsag?: number | null
          hcv?: number | null
          hiv?: number | null
          id?: string
          remarks?: string | null
          technician?: string | null
          updated_at?: string | null
          vdrl?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bleeding_records_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bleeding_records_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors_with_combined_blood_group"
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
          {
            foreignKeyName: "blood_inventory_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors_with_combined_blood_group"
            referencedColumns: ["id"]
          },
        ]
      }
      crossmatch_records: {
        Row: {
          age: number | null
          albumin: string
          blood_category: string | null
          blood_group: string | null
          coomb: string
          created_at: string | null
          crossmatch_no: string
          date: string
          expiry_date: string | null
          hospital: string | null
          id: string
          patient_name: string
          pre_crossmatch_doc_no: string | null
          product_id: string | null
          quantity: number
          remarks: string | null
          result: string
          rh: string | null
          saline: string
          sex: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          albumin?: string
          blood_category?: string | null
          blood_group?: string | null
          coomb?: string
          created_at?: string | null
          crossmatch_no: string
          date?: string
          expiry_date?: string | null
          hospital?: string | null
          id?: string
          patient_name: string
          pre_crossmatch_doc_no?: string | null
          product_id?: string | null
          quantity?: number
          remarks?: string | null
          result?: string
          rh?: string | null
          saline?: string
          sex?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          albumin?: string
          blood_category?: string | null
          blood_group?: string | null
          coomb?: string
          created_at?: string | null
          crossmatch_no?: string
          date?: string
          expiry_date?: string | null
          hospital?: string | null
          id?: string
          patient_name?: string
          pre_crossmatch_doc_no?: string | null
          product_id?: string | null
          quantity?: number
          remarks?: string | null
          result?: string
          rh?: string | null
          saline?: string
          sex?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      document_sequences: {
        Row: {
          created_at: string
          id: string
          sequence_number: number
          updated_at: string
          year_month: string
        }
        Insert: {
          created_at?: string
          id?: string
          sequence_number?: number
          updated_at?: string
          year_month: string
        }
        Update: {
          created_at?: string
          id?: string
          sequence_number?: number
          updated_at?: string
          year_month?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string
          email: string
          id: string
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          email: string
          id?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          email?: string
          id?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      donors: {
        Row: {
          address: string | null
          blood_group: Database["public"]["Enums"]["blood_group"]
          blood_group_separate: string | null
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
          rh_factor: string | null
          status: boolean | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          blood_group: Database["public"]["Enums"]["blood_group"]
          blood_group_separate?: string | null
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
          rh_factor?: string | null
          status?: boolean | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          blood_group?: Database["public"]["Enums"]["blood_group"]
          blood_group_separate?: string | null
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
          rh_factor?: string | null
          status?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          invoice_id: string
          quantity: number
          test_id: number | null
          test_name: string
          total_price: number
          type: string | null
          unit_price: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          invoice_id: string
          quantity?: number
          test_id?: number | null
          test_name: string
          total_price?: number
          type?: string | null
          unit_price?: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          invoice_id?: string
          quantity?: number
          test_id?: number | null
          test_name?: string
          total_price?: number
          type?: string | null
          unit_price?: number
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
          age: number | null
          amount_received: number | null
          blood_category: string | null
          blood_group_separate: string | null
          bottle_quantity: number | null
          bottle_unit: string | null
          created_at: string | null
          created_by: string | null
          discount_amount: number | null
          dob: string | null
          document_date: string
          document_no: string
          ex_donor: string | null
          gender: string | null
          hospital_name: string | null
          id: string
          patient_id: string | null
          patient_name: string
          patient_type: string
          phone_no: string | null
          reference_notes: string | null
          rh_factor: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          amount_received?: number | null
          blood_category?: string | null
          blood_group_separate?: string | null
          bottle_quantity?: number | null
          bottle_unit?: string | null
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          dob?: string | null
          document_date?: string
          document_no: string
          ex_donor?: string | null
          gender?: string | null
          hospital_name?: string | null
          id?: string
          patient_id?: string | null
          patient_name: string
          patient_type: string
          phone_no?: string | null
          reference_notes?: string | null
          rh_factor?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          amount_received?: number | null
          blood_category?: string | null
          blood_group_separate?: string | null
          bottle_quantity?: number | null
          bottle_unit?: string | null
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          dob?: string | null
          document_date?: string
          document_no?: string
          ex_donor?: string | null
          gender?: string | null
          hospital_name?: string | null
          id?: string
          patient_id?: string | null
          patient_name?: string
          patient_type?: string
          phone_no?: string | null
          reference_notes?: string | null
          rh_factor?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          age: number | null
          blood_group: Database["public"]["Enums"]["blood_group"]
          blood_group_separate: string | null
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
          rh_factor: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          blood_group: Database["public"]["Enums"]["blood_group"]
          blood_group_separate?: string | null
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
          rh_factor?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          age?: number | null
          blood_group?: Database["public"]["Enums"]["blood_group"]
          blood_group_separate?: string | null
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
          rh_factor?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pre_crossmatch: {
        Row: {
          age: number | null
          blood_group: string | null
          created_at: string | null
          document_no: string
          hospital: string | null
          patient_name: string
          rh: string | null
          sex: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          blood_group?: string | null
          created_at?: string | null
          document_no: string
          hospital?: string | null
          patient_name: string
          rh?: string | null
          sex?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          blood_group?: string | null
          created_at?: string | null
          document_no?: string
          hospital?: string | null
          patient_name?: string
          rh?: string | null
          sex?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pre_report: {
        Row: {
          age: number | null
          blood_category: string | null
          blood_group: string | null
          bottle_required: number | null
          category: string | null
          created_at: string | null
          dob: string | null
          document_no: string
          gender: string | null
          hospital_name: string | null
          patient_id: string | null
          patient_name: string
          phone: string | null
          reference: string | null
          registration_date: string | null
          rh: string | null
          tests_type: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          blood_category?: string | null
          blood_group?: string | null
          bottle_required?: number | null
          category?: string | null
          created_at?: string | null
          dob?: string | null
          document_no: string
          gender?: string | null
          hospital_name?: string | null
          patient_id?: string | null
          patient_name: string
          phone?: string | null
          reference?: string | null
          registration_date?: string | null
          rh?: string | null
          tests_type?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          blood_category?: string | null
          blood_group?: string | null
          bottle_required?: number | null
          category?: string | null
          created_at?: string | null
          dob?: string | null
          document_no?: string
          gender?: string | null
          hospital_name?: string | null
          patient_id?: string | null
          patient_name?: string
          phone?: string | null
          reference?: string | null
          registration_date?: string | null
          rh?: string | null
          tests_type?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          bag_no: string
          created_at: string
          donor_name: string
          id: string
          product: string
          updated_at: string
        }
        Insert: {
          bag_no: string
          created_at?: string
          donor_name: string
          id?: string
          product: string
          updated_at?: string
        }
        Update: {
          bag_no?: string
          created_at?: string
          donor_name?: string
          id?: string
          product?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_bag_no_fkey"
            columns: ["bag_no"]
            isOneToOne: false
            referencedRelation: "bleeding_records"
            referencedColumns: ["bag_id"]
          },
        ]
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
          test_type: string
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
          test_type?: string
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
          test_type?: string
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
      test_report_results: {
        Row: {
          category: string | null
          created_at: string | null
          document_no: string
          high_flag: boolean | null
          high_value: string | null
          id: string
          low_flag: boolean | null
          low_value: string | null
          measuring_unit: string | null
          test_id: number
          test_name: string
          updated_at: string | null
          user_value: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          document_no: string
          high_flag?: boolean | null
          high_value?: string | null
          id?: string
          low_flag?: boolean | null
          low_value?: string | null
          measuring_unit?: string | null
          test_id: number
          test_name: string
          updated_at?: string | null
          user_value?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          document_no?: string
          high_flag?: boolean | null
          high_value?: string | null
          id?: string
          low_flag?: boolean | null
          low_value?: string | null
          measuring_unit?: string | null
          test_id?: number
          test_name?: string
          updated_at?: string | null
          user_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_report_results_document_no_fkey"
            columns: ["document_no"]
            isOneToOne: false
            referencedRelation: "pre_report"
            referencedColumns: ["document_no"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          address: string | null
          age: number | null
          availability: string | null
          created_at: string
          email: string
          experience: string | null
          id: string
          interests: string | null
          motivation: string
          name: string
          occupation: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          age?: number | null
          availability?: string | null
          created_at?: string
          email: string
          experience?: string | null
          id?: string
          interests?: string | null
          motivation: string
          name: string
          occupation?: string | null
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          age?: number | null
          availability?: string | null
          created_at?: string
          email?: string
          experience?: string | null
          id?: string
          interests?: string | null
          motivation?: string
          name?: string
          occupation?: string | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      donors_with_combined_blood_group: {
        Row: {
          address: string | null
          blood_group: Database["public"]["Enums"]["blood_group"] | null
          blood_group_separate: string | null
          combined_blood_group: string | null
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          donor_id: string | null
          email: string | null
          gender: string | null
          id: string | null
          last_donation_date: string | null
          name: string | null
          phone: string | null
          rh_factor: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          blood_group?: Database["public"]["Enums"]["blood_group"] | null
          blood_group_separate?: string | null
          combined_blood_group?: never
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          donor_id?: string | null
          email?: string | null
          gender?: string | null
          id?: string | null
          last_donation_date?: string | null
          name?: string | null
          phone?: string | null
          rh_factor?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          blood_group?: Database["public"]["Enums"]["blood_group"] | null
          blood_group_separate?: string | null
          combined_blood_group?: never
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          donor_id?: string | null
          email?: string | null
          gender?: string | null
          id?: string | null
          last_donation_date?: string | null
          name?: string | null
          phone?: string | null
          rh_factor?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      patients_with_combined_blood_group: {
        Row: {
          address: string | null
          age: number | null
          blood_group: Database["public"]["Enums"]["blood_group"] | null
          blood_group_separate: string | null
          bottle_quantity: number | null
          bottle_unit_type: string | null
          combined_blood_group: string | null
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          email: string | null
          gender: string | null
          hospital: string | null
          id: string | null
          name: string | null
          patient_id: string | null
          phone: string | null
          rh_factor: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          blood_group?: Database["public"]["Enums"]["blood_group"] | null
          blood_group_separate?: string | null
          bottle_quantity?: number | null
          bottle_unit_type?: string | null
          combined_blood_group?: never
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          hospital?: string | null
          id?: string | null
          name?: string | null
          patient_id?: string | null
          phone?: string | null
          rh_factor?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          age?: number | null
          blood_group?: Database["public"]["Enums"]["blood_group"] | null
          blood_group_separate?: string | null
          bottle_quantity?: number | null
          bottle_unit_type?: string | null
          combined_blood_group?: never
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          hospital?: string | null
          id?: string | null
          name?: string | null
          patient_id?: string | null
          phone?: string | null
          rh_factor?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_document_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_patient_reg_number: {
        Args: { prefix_type: string }
        Returns: string
      }
      get_combined_blood_group: {
        Args: { bg_separate: string; rh: string }
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
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_test_active: {
        Args: { test_description: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "lab" | "bds" | "reception"
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
      app_role: ["lab", "bds", "reception"],
      blood_group: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      blood_status: ["Available", "Reserved", "Used", "Expired", "Discarded"],
    },
  },
} as const
