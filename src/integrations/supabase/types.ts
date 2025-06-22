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
      ai_generated_content: {
        Row: {
          content_type: string
          context_data: Json | null
          created_at: string | null
          feedback_rating: number | null
          generated_content: string
          id: string
          original_prompt: string | null
          updated_at: string | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          content_type: string
          context_data?: Json | null
          created_at?: string | null
          feedback_rating?: number | null
          generated_content: string
          id?: string
          original_prompt?: string | null
          updated_at?: string | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          content_type?: string
          context_data?: Json | null
          created_at?: string | null
          feedback_rating?: number | null
          generated_content?: string
          id?: string
          original_prompt?: string | null
          updated_at?: string | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_insights: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          description: string
          estimated_savings: number | null
          id: string
          insight_type: string
          priority: string | null
          property_id: string | null
          recommended_action: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          description: string
          estimated_savings?: number | null
          id?: string
          insight_type: string
          priority?: string | null
          property_id?: string | null
          recommended_action?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          description?: string
          estimated_savings?: number | null
          id?: string
          insight_type?: string
          priority?: string | null
          property_id?: string | null
          recommended_action?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_predictions: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          data_sources: string[] | null
          description: string
          estimated_cost: number | null
          id: string
          predicted_date: string | null
          prediction_type: string
          prevention_actions: string[] | null
          property_id: string | null
          status: string | null
          title: string
          unit_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          data_sources?: string[] | null
          description: string
          estimated_cost?: number | null
          id?: string
          predicted_date?: string | null
          prediction_type: string
          prevention_actions?: string[] | null
          property_id?: string | null
          status?: string | null
          title: string
          unit_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          data_sources?: string[] | null
          description?: string
          estimated_cost?: number | null
          id?: string
          predicted_date?: string | null
          prediction_type?: string
          prevention_actions?: string[] | null
          property_id?: string | null
          status?: string | null
          title?: string
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_predictions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_predictions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_accounts: {
        Row: {
          account_type: string | null
          balance: number | null
          created_at: string | null
          frozen_balance: number | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_type?: string | null
          balance?: number | null
          created_at?: string | null
          frozen_balance?: number | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_type?: string | null
          balance?: number | null
          created_at?: string | null
          frozen_balance?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      escrow_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          escrow_account_id: string
          from_user_id: string | null
          id: string
          purpose: string | null
          release_conditions: string | null
          scheduled_release: string | null
          status: string | null
          to_user_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          escrow_account_id: string
          from_user_id?: string | null
          id?: string
          purpose?: string | null
          release_conditions?: string | null
          scheduled_release?: string | null
          status?: string | null
          to_user_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          escrow_account_id?: string
          from_user_id?: string | null
          id?: string
          purpose?: string | null
          release_conditions?: string | null
          scheduled_release?: string | null
          status?: string | null
          to_user_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escrow_transactions_escrow_account_id_fkey"
            columns: ["escrow_account_id"]
            isOneToOne: false
            referencedRelation: "escrow_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          actual_cost: number | null
          assigned_to: string | null
          category: string | null
          completed_date: string | null
          created_at: string | null
          description: string | null
          estimated_cost: number | null
          id: string
          priority: string | null
          property_id: string
          scheduled_date: string | null
          status: string | null
          tenant_id: string
          title: string
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          assigned_to?: string | null
          category?: string | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          priority?: string | null
          property_id: string
          scheduled_date?: string | null
          status?: string | null
          tenant_id: string
          title: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          assigned_to?: string | null
          category?: string | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          priority?: string | null
          property_id?: string
          scheduled_date?: string | null
          status?: string | null
          tenant_id?: string
          title?: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_work_progress: {
        Row: {
          created_at: string | null
          escrow_amount: number | null
          id: string
          images: string[] | null
          maintenance_request_id: string
          progress_percentage: number | null
          status_update: string | null
          updated_at: string | null
          updated_by: string | null
          vendor_name: string | null
          work_description: string | null
        }
        Insert: {
          created_at?: string | null
          escrow_amount?: number | null
          id?: string
          images?: string[] | null
          maintenance_request_id: string
          progress_percentage?: number | null
          status_update?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_name?: string | null
          work_description?: string | null
        }
        Update: {
          created_at?: string | null
          escrow_amount?: number | null
          id?: string
          images?: string[] | null
          maintenance_request_id?: string
          progress_percentage?: number | null
          status_update?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_name?: string | null
          work_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_work_progress_maintenance_request_id_fkey"
            columns: ["maintenance_request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          landlord_id: string
          paid_date: string | null
          payment_method: string | null
          payment_type: string | null
          property_id: string
          status: string | null
          tenant_id: string
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          landlord_id: string
          paid_date?: string | null
          payment_method?: string | null
          payment_type?: string | null
          property_id: string
          status?: string | null
          tenant_id: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          landlord_id?: string
          paid_date?: string | null
          payment_method?: string | null
          payment_type?: string | null
          property_id?: string
          status?: string | null
          tenant_id?: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[] | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          name: string
          property_type: string | null
          size: number | null
          state: string | null
          units_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          amenities?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          name: string
          property_type?: string | null
          size?: number | null
          state?: string | null
          units_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          amenities?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          name?: string
          property_type?: string | null
          size?: number | null
          state?: string | null
          units_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      service_charge_payments: {
        Row: {
          amount: number
          created_at: string | null
          escrow_released: boolean | null
          id: string
          payment_date: string | null
          service_charge_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          escrow_released?: boolean | null
          id?: string
          payment_date?: string | null
          service_charge_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          escrow_released?: boolean | null
          id?: string
          payment_date?: string | null
          service_charge_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_charge_payments_service_charge_id_fkey"
            columns: ["service_charge_id"]
            isOneToOne: false
            referencedRelation: "service_charges"
            referencedColumns: ["id"]
          },
        ]
      }
      service_charges: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          escrow_held: number | null
          frequency: string | null
          id: string
          next_due_date: string
          status: string | null
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          escrow_held?: number | null
          frequency?: string | null
          id?: string
          next_due_date: string
          status?: string | null
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          escrow_held?: number | null
          frequency?: string | null
          id?: string
          next_due_date?: string
          status?: string | null
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_charges_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          created_at: string | null
          deposit_amount: number | null
          id: string
          lease_end_date: string | null
          lease_start_date: string | null
          property_id: string
          rent_amount: number
          status: string | null
          tenant_id: string | null
          unit_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deposit_amount?: number | null
          id?: string
          lease_end_date?: string | null
          lease_start_date?: string | null
          property_id: string
          rent_amount: number
          status?: string | null
          tenant_id?: string | null
          unit_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deposit_amount?: number | null
          id?: string
          lease_end_date?: string | null
          lease_start_date?: string | null
          property_id?: string
          rent_amount?: number
          status?: string | null
          tenant_id?: string | null
          unit_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
