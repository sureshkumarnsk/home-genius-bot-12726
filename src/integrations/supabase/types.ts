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
      addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean | null
          label: string | null
          latitude: number | null
          longitude: number | null
          postal_code: string
          state: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code: string
          state: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string
          state?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      basket_items: {
        Row: {
          added_at: string
          added_by_user_id: string | null
          basket_id: string
          id: string
          is_suggestion: boolean | null
          product_id: string
          quantity: number
          unit: string | null
        }
        Insert: {
          added_at?: string
          added_by_user_id?: string | null
          basket_id: string
          id?: string
          is_suggestion?: boolean | null
          product_id: string
          quantity: number
          unit?: string | null
        }
        Update: {
          added_at?: string
          added_by_user_id?: string | null
          basket_id?: string
          id?: string
          is_suggestion?: boolean | null
          product_id?: string
          quantity?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "basket_items_added_by_user_id_fkey"
            columns: ["added_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "basket_items_basket_id_fkey"
            columns: ["basket_id"]
            isOneToOne: false
            referencedRelation: "baskets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "basket_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      baskets: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "baskets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          amount: number
          bill_date: string
          category: string | null
          created_at: string
          currency: string | null
          extracted_data: Json | null
          file_url: string | null
          id: string
          source: Database["public"]["Enums"]["bill_source"]
          user_id: string
          vendor_name: string | null
        }
        Insert: {
          amount: number
          bill_date: string
          category?: string | null
          created_at?: string
          currency?: string | null
          extracted_data?: Json | null
          file_url?: string | null
          id?: string
          source: Database["public"]["Enums"]["bill_source"]
          user_id: string
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          bill_date?: string
          category?: string | null
          created_at?: string
          currency?: string | null
          extracted_data?: Json | null
          file_url?: string | null
          id?: string
          source?: Database["public"]["Enums"]["bill_source"]
          user_id?: string
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          added_at: string
          can_add_items: boolean | null
          can_place_orders: boolean | null
          household_primary_user_id: string
          id: string
          relationship: string | null
          user_id: string
        }
        Insert: {
          added_at?: string
          can_add_items?: boolean | null
          can_place_orders?: boolean | null
          household_primary_user_id: string
          id?: string
          relationship?: string | null
          user_id: string
        }
        Update: {
          added_at?: string
          can_add_items?: boolean | null
          can_place_orders?: boolean | null
          household_primary_user_id?: string
          id?: string
          relationship?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_household_primary_user_id_fkey"
            columns: ["household_primary_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          created_at: string
          expiry_date: string | null
          id: string
          location: string | null
          product_id: string
          purchase_date: string | null
          quantity: number
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          location?: string | null
          product_id: string
          purchase_date?: string | null
          quantity: number
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          location?: string | null
          product_id?: string
          purchase_date?: string | null
          quantity?: number
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          delivered_at: string | null
          id: string
          order_id: string
          product_catalog_id: string | null
          product_id: string
          quantity: number
          total_price: number
          unit: string | null
          unit_price: number
          vendor_id: string
          vendor_order_id: string | null
        }
        Insert: {
          delivered_at?: string | null
          id?: string
          order_id: string
          product_catalog_id?: string | null
          product_id: string
          quantity: number
          total_price: number
          unit?: string | null
          unit_price: number
          vendor_id: string
          vendor_order_id?: string | null
        }
        Update: {
          delivered_at?: string | null
          id?: string
          order_id?: string
          product_catalog_id?: string | null
          product_id?: string
          quantity?: number
          total_price?: number
          unit?: string | null
          unit_price?: number
          vendor_id?: string
          vendor_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_catalog_id_fkey"
            columns: ["product_catalog_id"]
            isOneToOne: false
            referencedRelation: "product_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          basket_id: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          currency: string | null
          delivered_at: string | null
          delivery_address_id: string | null
          delivery_fee: number | null
          id: string
          is_auto_order: boolean | null
          order_number: string
          payment_method: string | null
          placed_at: string
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax: number | null
          total: number
          user_id: string
        }
        Insert: {
          basket_id?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          currency?: string | null
          delivered_at?: string | null
          delivery_address_id?: string | null
          delivery_fee?: number | null
          id?: string
          is_auto_order?: boolean | null
          order_number: string
          payment_method?: string | null
          placed_at?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax?: number | null
          total: number
          user_id: string
        }
        Update: {
          basket_id?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          currency?: string | null
          delivered_at?: string | null
          delivery_address_id?: string | null
          delivery_fee?: number | null
          id?: string
          is_auto_order?: boolean | null
          order_number?: string
          payment_method?: string | null
          placed_at?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax?: number | null
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_basket_id_fkey"
            columns: ["basket_id"]
            isOneToOne: false
            referencedRelation: "baskets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_catalog: {
        Row: {
          created_at: string
          current_price: number | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          is_available: boolean | null
          mrp: number | null
          pack_size: string | null
          product_id: string
          product_url: string | null
          updated_at: string
          vendor_id: string
          vendor_product_name: string | null
          vendor_sku: string
        }
        Insert: {
          created_at?: string
          current_price?: number | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          is_available?: boolean | null
          mrp?: number | null
          pack_size?: string | null
          product_id: string
          product_url?: string | null
          updated_at?: string
          vendor_id: string
          vendor_product_name?: string | null
          vendor_sku: string
        }
        Update: {
          created_at?: string
          current_price?: number | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          is_available?: boolean | null
          mrp?: number | null
          pack_size?: string | null
          product_id?: string
          product_url?: string | null
          updated_at?: string
          vendor_id?: string
          vendor_product_name?: string | null
          vendor_sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_catalog_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_catalog_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          normalized_name: string
          subcategory: string | null
          typical_shelf_life_days: number | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          normalized_name: string
          subcategory?: string | null
          typical_shelf_life_days?: number | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          normalized_name?: string
          subcategory?: string | null
          typical_shelf_life_days?: number | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          household_size: number | null
          id: string
          last_login_at: string | null
          phone: string | null
          preferred_language: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          household_size?: number | null
          id: string
          last_login_at?: string | null
          phone?: string | null
          preferred_language?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          household_size?: number | null
          id?: string
          last_login_at?: string | null
          phone?: string | null
          preferred_language?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          avg_delivery_time_hours: number | null
          created_at: string
          delivery_fee: number | null
          free_delivery_threshold: number | null
          id: string
          logo_url: string | null
          min_order_value: number | null
          name: string
          reliability_score: number | null
          slug: string
          status: Database["public"]["Enums"]["vendor_status"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          avg_delivery_time_hours?: number | null
          created_at?: string
          delivery_fee?: number | null
          free_delivery_threshold?: number | null
          id?: string
          logo_url?: string | null
          min_order_value?: number | null
          name: string
          reliability_score?: number | null
          slug: string
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          avg_delivery_time_hours?: number | null
          created_at?: string
          delivery_fee?: number | null
          free_delivery_threshold?: number | null
          id?: string
          logo_url?: string | null
          min_order_value?: number | null
          name?: string
          reliability_score?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          website_url?: string | null
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
      app_role: "admin" | "user" | "vendor"
      bill_source: "email" | "sms" | "manual_upload" | "api"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded"
      reorder_status: "disabled" | "enabled" | "snoozed"
      vendor_status: "active" | "inactive" | "suspended"
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
      app_role: ["admin", "user", "vendor"],
      bill_source: ["email", "sms", "manual_upload", "api"],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      reorder_status: ["disabled", "enabled", "snoozed"],
      vendor_status: ["active", "inactive", "suspended"],
    },
  },
} as const
