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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      booking_confirmations_backup: {
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
        Relationships: []
      }
      booking_rate_limits_backup: {
        Row: {
          blocked_until: string | null
          booking_count: number | null
          created_at: string | null
          first_booking_at: string | null
          id: string
          identifier: string
          identifier_type: string
          is_blocked: boolean | null
          last_booking_at: string | null
          updated_at: string | null
        }
        Insert: {
          blocked_until?: string | null
          booking_count?: number | null
          created_at?: string | null
          first_booking_at?: string | null
          id?: string
          identifier: string
          identifier_type: string
          is_blocked?: boolean | null
          last_booking_at?: string | null
          updated_at?: string | null
        }
        Update: {
          blocked_until?: string | null
          booking_count?: number | null
          created_at?: string | null
          first_booking_at?: string | null
          id?: string
          identifier?: string
          identifier_type?: string
          is_blocked?: boolean | null
          last_booking_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          address: string | null
          booking_id: string
          booking_status: string
          cancelled_at: string | null
          check_in: string
          check_out: string
          city: string | null
          confirmed_at: string | null
          created_at: string
          email: string
          emergency_contact: string | null
          guest_name: string
          guests: number
          id: string
          payment_status: string | null
          pincode: string | null
          room_type: string
          source: string | null
          special_requests: string | null
          state: string | null
          subtotal: number
          taxes: number
          total_amount: number
          updated_at: string
          user_id: string | null
          whatsapp_number: string
        }
        Insert: {
          address?: string | null
          booking_id: string
          booking_status?: string
          cancelled_at?: string | null
          check_in: string
          check_out: string
          city?: string | null
          confirmed_at?: string | null
          created_at?: string
          email: string
          emergency_contact?: string | null
          guest_name: string
          guests?: number
          id?: string
          payment_status?: string | null
          pincode?: string | null
          room_type: string
          source?: string | null
          special_requests?: string | null
          state?: string | null
          subtotal: number
          taxes?: number
          total_amount: number
          updated_at?: string
          user_id?: string | null
          whatsapp_number: string
        }
        Update: {
          address?: string | null
          booking_id?: string
          booking_status?: string
          cancelled_at?: string | null
          check_in?: string
          check_out?: string
          city?: string | null
          confirmed_at?: string | null
          created_at?: string
          email?: string
          emergency_contact?: string | null
          guest_name?: string
          guests?: number
          id?: string
          payment_status?: string | null
          pincode?: string | null
          room_type?: string
          source?: string | null
          special_requests?: string | null
          state?: string | null
          subtotal?: number
          taxes?: number
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          whatsapp_number?: string
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
      metrics: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value?: number
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: number
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_login: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          last_login?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          role?: string | null
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
        Relationships: []
      }
      secret_access_log: {
        Row: {
          access_granted: boolean
          accessed_at: string
          id: string
          ip_address: string | null
          secret_name: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          access_granted?: boolean
          accessed_at?: string
          id?: string
          ip_address?: string | null
          secret_name: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          access_granted?: boolean
          accessed_at?: string
          id?: string
          ip_address?: string | null
          secret_name?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_id?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
    }
    Views: {
      bookings_masked: {
        Row: {
          address: string | null
          booking_id: string | null
          booking_status: string | null
          cancelled_at: string | null
          check_in: string | null
          check_out: string | null
          city: string | null
          confirmed_at: string | null
          created_at: string | null
          email: string | null
          emergency_contact: string | null
          guest_name: string | null
          guests: number | null
          id: string | null
          payment_status: string | null
          pincode: string | null
          room_type: string | null
          source: string | null
          special_requests: string | null
          state: string | null
          subtotal: number | null
          taxes: number | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
          whatsapp_number: string | null
        }
        Insert: {
          address?: never
          booking_id?: string | null
          booking_status?: string | null
          cancelled_at?: string | null
          check_in?: string | null
          check_out?: string | null
          city?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          email?: never
          emergency_contact?: never
          guest_name?: string | null
          guests?: number | null
          id?: string | null
          payment_status?: string | null
          pincode?: never
          room_type?: string | null
          source?: string | null
          special_requests?: string | null
          state?: string | null
          subtotal?: number | null
          taxes?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_number?: never
        }
        Update: {
          address?: never
          booking_id?: string | null
          booking_status?: string | null
          cancelled_at?: string | null
          check_in?: string | null
          check_out?: string | null
          city?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          email?: never
          emergency_contact?: never
          guest_name?: string | null
          guests?: number | null
          id?: string | null
          payment_status?: string | null
          pincode?: never
          room_type?: string | null
          source?: string | null
          special_requests?: string | null
          state?: string | null
          subtotal?: number | null
          taxes?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_number?: never
        }
        Relationships: []
      }
      newsletter_stats: {
        Row: {
          active_subscribers: number | null
          inactive_subscribers: number | null
          new_this_month: number | null
          new_this_week: number | null
          total_subscribers: number | null
          unique_interest_combinations: number | null
        }
        Relationships: []
      }
      secret_access_log_masked: {
        Row: {
          created_at: string | null
          event: string | null
          id: string | null
          ip: string | null
          path_preview: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          event?: never
          id?: string | null
          ip?: never
          path_preview?: never
          user_agent?: never
        }
        Update: {
          created_at?: string | null
          event?: never
          id?: string | null
          ip?: never
          path_preview?: never
          user_agent?: never
        }
        Relationships: []
      }
      security_alerts_masked: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string | null
          id: string | null
          ip: string | null
          resolved: boolean | null
          resolved_by: string | null
          severity: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type?: string | null
          id?: string | null
          ip?: never
          resolved?: boolean | null
          resolved_by?: string | null
          severity?: string | null
          user_agent?: never
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string | null
          id?: string | null
          ip?: never
          resolved?: boolean | null
          resolved_by?: string | null
          severity?: string | null
          user_agent?: never
        }
        Relationships: []
      }
      transactions_admin_view: {
        Row: {
          amount: number | null
          booking_id: string | null
          created_at: string | null
          currency: string | null
          gateway: string | null
          id: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          gateway?: string | null
          id?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          gateway?: string | null
          id?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_get_booking_pii: {
        Args: { p_booking_id: string }
        Returns: {
          address: string
          city: string
          email: string
          emergency_contact: string
          guest_name: string
          id: string
          pincode: string
          state: string
          whatsapp_number: string
        }[]
      }
      admin_search_bookings: {
        Args: {
          p_booking_id?: string
          p_email?: string
          p_guest_name?: string
          p_limit?: number
        }
        Returns: {
          booking_id: string
          booking_status: string
          check_in: string
          check_out: string
          created_at: string
          email: string
          guest_name: string
          guests: number
          id: string
          payment_status: string
          total_amount: number
          whatsapp_number: string
        }[]
      }
      check_suspicious_booking_activity: {
        Args: { email_param: string; time_window_hours?: number }
        Returns: {
          recent_bookings_count: number
          risk_score: number
          suspicious_indicators: string[]
        }[]
      }
      cleanup_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_my_data: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      export_my_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      generate_booking_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_app_secret: {
        Args: { secret_name: string }
        Returns: string
      }
      get_app_secret_secure: {
        Args: { secret_name: string }
        Returns: string
      }
      get_jwt_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_my_booking_pii: {
        Args: { p_booking_id: string }
        Returns: {
          address: string
          email: string
          emergency_contact: string
          id: string
          whatsapp_number: string
        }[]
      }
      get_my_bookings: {
        Args: Record<PropertyKey, never>
        Returns: {
          address_masked: string
          booking_id: string
          booking_status: string
          check_in: string
          check_out: string
          created_at: string
          email_masked: string
          guest_name: string
          guests: number
          id: string
          payment_status: string
          room_type: string
          total_amount: number
          whatsapp_masked: string
        }[]
      }
      get_newsletter_subscriber_details_admin: {
        Args: { p_subscriber_id: string }
        Returns: {
          email: string
          full_name: string
          id: string
          interests: string[]
          is_active: boolean
          subscribed_at: string
        }[]
      }
      get_single_booking_secure: {
        Args: { booking_id_param: string }
        Returns: {
          address: string
          booking_id: string
          booking_status: string
          cancelled_at: string
          check_in: string
          check_out: string
          city: string
          confirmed_at: string
          created_at: string
          email: string
          emergency_contact: string
          guest_name: string
          guests: number
          id: string
          payment_status: string
          pincode: string
          room_type: string
          source: string
          special_requests: string
          state: string
          subtotal: number
          taxes: number
          total_amount: number
          updated_at: string
          whatsapp_number: string
        }[]
      }
      get_transaction_details_admin: {
        Args: { p_transaction_id: string }
        Returns: {
          amount: number
          booking_id: string
          created_at: string
          currency: string
          gateway_response: Json
          id: string
          payment_status: string
          razorpay_payment_id: string
          txn_id: string
        }[]
      }
      get_user_bookings_secure: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          booking_id: string
          booking_status: string
          cancelled_at: string
          check_in: string
          check_out: string
          city: string
          confirmed_at: string
          created_at: string
          email: string
          emergency_contact: string
          guest_name: string
          guests: number
          id: string
          payment_status: string
          pincode: string
          room_type: string
          source: string
          special_requests: string
          state: string
          subtotal: number
          taxes: number
          total_amount: number
          updated_at: string
          whatsapp_number: string
        }[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment_happy_guests: {
        Args: Record<PropertyKey, never>
        Returns: {
          new_count: number
        }[]
      }
      increment_metric: {
        Args: { p_inc?: number; p_key: string }
        Returns: {
          key: string
          value: number
        }[]
      }
      ip_anonymize: {
        Args: { ip_text: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_or_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_pii_access: {
        Args: {
          p_access_type: string
          p_booking_id: string
          p_success?: boolean
        }
        Returns: undefined
      }
      norm_email: {
        Args: { e: string }
        Returns: string
      }
      resolve_security_alert_admin: {
        Args: { p_alert_id: string; p_resolution_notes?: string }
        Returns: boolean
      }
      verify_booking_owner_only: {
        Args: { booking_email: string }
        Returns: boolean
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
