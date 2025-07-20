export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      attractions: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          destination_id: string | null
          entry_fee: number | null
          google_place_id: string | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          rating: number | null
          type: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          destination_id?: string | null
          entry_fee?: number | null
          google_place_id?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          rating?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          destination_id?: string | null
          entry_fee?: number | null
          google_place_id?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          rating?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attractions_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_confirmations: {
        Row: {
          booking_id: string | null
          confirmation_sent_at: string | null
          created_at: string
          id: string
          sent_to_guest_email: boolean | null
          sent_to_guest_whatsapp: boolean | null
          sent_to_property_email: boolean | null
          sent_to_property_whatsapp: boolean | null
        }
        Insert: {
          booking_id?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          id?: string
          sent_to_guest_email?: boolean | null
          sent_to_guest_whatsapp?: boolean | null
          sent_to_property_email?: boolean | null
          sent_to_property_whatsapp?: boolean | null
        }
        Update: {
          booking_id?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          id?: string
          sent_to_guest_email?: boolean | null
          sent_to_guest_whatsapp?: boolean | null
          sent_to_property_email?: boolean | null
          sent_to_property_whatsapp?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_confirmations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          address: string | null
          booking_id: string
          booking_status: string | null
          check_in: string
          check_out: string
          city: string | null
          created_at: string
          discount_amount: number | null
          email: string
          emergency_contact: string | null
          emergency_relation: string | null
          gst_amount: number
          guest_name: string
          guests: number
          id: string
          invoice_generated: boolean | null
          invoice_url: string | null
          nights: number
          payment_method: string | null
          payment_verified_at: string | null
          pincode: string | null
          promo_applied: boolean | null
          promo_code: string | null
          room_details: Json
          state: string | null
          subtotal: number
          total_amount: number
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          address?: string | null
          booking_id: string
          booking_status?: string | null
          check_in: string
          check_out: string
          city?: string | null
          created_at?: string
          discount_amount?: number | null
          email: string
          emergency_contact?: string | null
          emergency_relation?: string | null
          gst_amount: number
          guest_name: string
          guests: number
          id?: string
          invoice_generated?: boolean | null
          invoice_url?: string | null
          nights: number
          payment_method?: string | null
          payment_verified_at?: string | null
          pincode?: string | null
          promo_applied?: boolean | null
          promo_code?: string | null
          room_details: Json
          state?: string | null
          subtotal: number
          total_amount: number
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          address?: string | null
          booking_id?: string
          booking_status?: string | null
          check_in?: string
          check_out?: string
          city?: string | null
          created_at?: string
          discount_amount?: number | null
          email?: string
          emergency_contact?: string | null
          emergency_relation?: string | null
          gst_amount?: number
          guest_name?: string
          guests?: number
          id?: string
          invoice_generated?: boolean | null
          invoice_url?: string | null
          nights?: number
          payment_method?: string | null
          payment_verified_at?: string | null
          pincode?: string | null
          promo_applied?: boolean | null
          promo_code?: string | null
          room_details?: Json
          state?: string | null
          subtotal?: number
          total_amount?: number
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json
          session_id: string
          updated_at: string
          user_email: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          session_id: string
          updated_at?: string
          user_email?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          session_id?: string
          updated_at?: string
          user_email?: string | null
        }
        Relationships: []
      }
      destinations: {
        Row: {
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          state: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          state: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      itineraries: {
        Row: {
          activities: Json
          best_season: string | null
          created_at: string
          description: string | null
          destinations: Json
          difficulty_level: string | null
          duration_days: number
          estimated_cost: number | null
          external_url: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          source: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          activities?: Json
          best_season?: string | null
          created_at?: string
          description?: string | null
          destinations?: Json
          difficulty_level?: string | null
          duration_days: number
          estimated_cost?: number | null
          external_url?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          source?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          activities?: Json
          best_season?: string | null
          created_at?: string
          description?: string | null
          destinations?: Json
          difficulty_level?: string | null
          duration_days?: number
          estimated_cost?: number | null
          external_url?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          source?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          interests: string[] | null
          is_active: boolean
          subscribed_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          interests?: string[] | null
          is_active?: boolean
          subscribed_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          interests?: string[] | null
          is_active?: boolean
          subscribed_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          created_at: string
          guest_name: string
          id: string
          photos: string[] | null
          rating: number
          review_text: string | null
          verified: boolean | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          guest_name: string
          id?: string
          photos?: string[] | null
          rating: number
          review_text?: string | null
          verified?: boolean | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          guest_name?: string
          id?: string
          photos?: string[] | null
          rating?: number
          review_text?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string | null
          gateway_response: Json | null
          id: string
          matched: boolean | null
          payment_status: string | null
          razorpay_payment_id: string | null
          source: string | null
          txn_id: string
          verified_at: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string | null
          gateway_response?: Json | null
          id?: string
          matched?: boolean | null
          payment_status?: string | null
          razorpay_payment_id?: string | null
          source?: string | null
          txn_id: string
          verified_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string | null
          gateway_response?: Json | null
          id?: string
          matched?: boolean | null
          payment_status?: string | null
          razorpay_payment_id?: string | null
          source?: string | null
          txn_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_booking_id: {
        Args: Record<PropertyKey, never>
        Returns: string
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
