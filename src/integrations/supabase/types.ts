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
      admin_notifications: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          read_at: string | null
          title: string
          type: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          read_at?: string | null
          title: string
          type: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          read_at?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      analytics_conversions: {
        Row: {
          conversion_value: number | null
          created_at: string | null
          currency: string | null
          funnel_name: string
          funnel_step: string
          id: string
          is_completed: boolean | null
          metadata: Json | null
          package_type: string | null
          room_type: string | null
          session_id: string
          step_order: number | null
          visitor_id: string
        }
        Insert: {
          conversion_value?: number | null
          created_at?: string | null
          currency?: string | null
          funnel_name: string
          funnel_step: string
          id?: string
          is_completed?: boolean | null
          metadata?: Json | null
          package_type?: string | null
          room_type?: string | null
          session_id: string
          step_order?: number | null
          visitor_id: string
        }
        Update: {
          conversion_value?: number | null
          created_at?: string | null
          currency?: string | null
          funnel_name?: string
          funnel_step?: string
          id?: string
          is_completed?: boolean | null
          metadata?: Json | null
          package_type?: string | null
          room_type?: string | null
          session_id?: string
          step_order?: number | null
          visitor_id?: string
        }
        Relationships: []
      }
      analytics_daily_metrics: {
        Row: {
          avg_session_duration: number | null
          bounce_rate: number | null
          country_breakdown: Json | null
          created_at: string | null
          date: string
          device_breakdown: Json | null
          id: string
          new_visitors: number | null
          pages_per_session: number | null
          returning_visitors: number | null
          top_pages: Json | null
          top_referrers: Json | null
          total_conversions: number | null
          total_events: number | null
          total_pageviews: number | null
          total_revenue: number | null
          total_sessions: number | null
          total_visitors: number | null
          updated_at: string | null
        }
        Insert: {
          avg_session_duration?: number | null
          bounce_rate?: number | null
          country_breakdown?: Json | null
          created_at?: string | null
          date: string
          device_breakdown?: Json | null
          id?: string
          new_visitors?: number | null
          pages_per_session?: number | null
          returning_visitors?: number | null
          top_pages?: Json | null
          top_referrers?: Json | null
          total_conversions?: number | null
          total_events?: number | null
          total_pageviews?: number | null
          total_revenue?: number | null
          total_sessions?: number | null
          total_visitors?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_session_duration?: number | null
          bounce_rate?: number | null
          country_breakdown?: Json | null
          created_at?: string | null
          date?: string
          device_breakdown?: Json | null
          id?: string
          new_visitors?: number | null
          pages_per_session?: number | null
          returning_visitors?: number | null
          top_pages?: Json | null
          top_referrers?: Json | null
          total_conversions?: number | null
          total_events?: number | null
          total_pageviews?: number | null
          total_revenue?: number | null
          total_sessions?: number | null
          total_visitors?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          element_class: string | null
          element_id: string | null
          element_text: string | null
          event_action: string
          event_category: string
          event_label: string | null
          event_value: number | null
          id: string
          metadata: Json | null
          page_path: string | null
          session_id: string
          visitor_id: string
        }
        Insert: {
          created_at?: string | null
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          event_action: string
          event_category: string
          event_label?: string | null
          event_value?: number | null
          id?: string
          metadata?: Json | null
          page_path?: string | null
          session_id: string
          visitor_id: string
        }
        Update: {
          created_at?: string | null
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          event_action?: string
          event_category?: string
          event_label?: string | null
          event_value?: number | null
          id?: string
          metadata?: Json | null
          page_path?: string | null
          session_id?: string
          visitor_id?: string
        }
        Relationships: []
      }
      analytics_geo_heatmap: {
        Row: {
          avg_session_duration: number | null
          booking_count: number | null
          bounce_rate: number | null
          city: string | null
          country_code: string
          country_name: string | null
          created_at: string | null
          date: string | null
          id: string
          latitude: number | null
          longitude: number | null
          pageview_count: number | null
          region: string | null
          revenue_total: number | null
          session_count: number | null
          updated_at: string | null
          visitor_count: number | null
        }
        Insert: {
          avg_session_duration?: number | null
          booking_count?: number | null
          bounce_rate?: number | null
          city?: string | null
          country_code: string
          country_name?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          pageview_count?: number | null
          region?: string | null
          revenue_total?: number | null
          session_count?: number | null
          updated_at?: string | null
          visitor_count?: number | null
        }
        Update: {
          avg_session_duration?: number | null
          booking_count?: number | null
          bounce_rate?: number | null
          city?: string | null
          country_code?: string
          country_name?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          pageview_count?: number | null
          region?: string | null
          revenue_total?: number | null
          session_count?: number | null
          updated_at?: string | null
          visitor_count?: number | null
        }
        Relationships: []
      }
      analytics_pageviews: {
        Row: {
          created_at: string | null
          id: string
          is_entrance: boolean | null
          is_exit: boolean | null
          page_hash: string | null
          page_path: string
          page_title: string | null
          referrer_path: string | null
          scroll_depth_percent: number | null
          session_id: string
          time_on_page_seconds: number | null
          visitor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_entrance?: boolean | null
          is_exit?: boolean | null
          page_hash?: string | null
          page_path: string
          page_title?: string | null
          referrer_path?: string | null
          scroll_depth_percent?: number | null
          session_id: string
          time_on_page_seconds?: number | null
          visitor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_entrance?: boolean | null
          is_exit?: boolean | null
          page_hash?: string | null
          page_path?: string
          page_title?: string | null
          referrer_path?: string | null
          scroll_depth_percent?: number | null
          session_id?: string
          time_on_page_seconds?: number | null
          visitor_id?: string
        }
        Relationships: []
      }
      analytics_realtime: {
        Row: {
          country_code: string | null
          created_at: string | null
          device_type: string | null
          id: string
          last_seen_at: string | null
          page_path: string | null
          session_id: string
          visitor_id: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          last_seen_at?: string | null
          page_path?: string | null
          session_id: string
          visitor_id: string
        }
        Update: {
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          last_seen_at?: string | null
          page_path?: string | null
          session_id?: string
          visitor_id?: string
        }
        Relationships: []
      }
      analytics_sessions: {
        Row: {
          browser: string | null
          city: string | null
          country_code: string | null
          created_at: string | null
          device_type: string | null
          ended_at: string | null
          events_count: number | null
          exit_page: string | null
          id: string
          is_bounce: boolean | null
          is_new_visitor: boolean | null
          landing_page: string | null
          last_activity_at: string | null
          latitude: number | null
          longitude: number | null
          os: string | null
          page_views: number | null
          referrer_medium: string | null
          referrer_source: string | null
          referrer_url: string | null
          region: string | null
          screen_height: number | null
          screen_width: number | null
          session_duration_seconds: number | null
          session_id: string
          started_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          ended_at?: string | null
          events_count?: number | null
          exit_page?: string | null
          id?: string
          is_bounce?: boolean | null
          is_new_visitor?: boolean | null
          landing_page?: string | null
          last_activity_at?: string | null
          latitude?: number | null
          longitude?: number | null
          os?: string | null
          page_views?: number | null
          referrer_medium?: string | null
          referrer_source?: string | null
          referrer_url?: string | null
          region?: string | null
          screen_height?: number | null
          screen_width?: number | null
          session_duration_seconds?: number | null
          session_id: string
          started_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          ended_at?: string | null
          events_count?: number | null
          exit_page?: string | null
          id?: string
          is_bounce?: boolean | null
          is_new_visitor?: boolean | null
          landing_page?: string | null
          last_activity_at?: string | null
          latitude?: number | null
          longitude?: number | null
          os?: string | null
          page_views?: number | null
          referrer_medium?: string | null
          referrer_source?: string | null
          referrer_url?: string | null
          region?: string | null
          screen_height?: number | null
          screen_width?: number | null
          session_duration_seconds?: number | null
          session_id?: string
          started_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blocked_dates: {
        Row: {
          blocked: boolean | null
          created_at: string | null
          date: string
          id: string
          property_id: string | null
          room_type: string
        }
        Insert: {
          blocked?: boolean | null
          created_at?: string | null
          date: string
          id?: string
          property_id?: string | null
          room_type: string
        }
        Update: {
          blocked?: boolean | null
          created_at?: string | null
          date?: string
          id?: string
          property_id?: string | null
          room_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_dates_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_invoices: {
        Row: {
          booking_id: string
          check_in: string
          check_out: string
          created_at: string | null
          currency: string | null
          gst_amount: number
          gst_rate: number
          guest_address: string | null
          guest_city: string | null
          guest_email: string
          guest_name: string
          guest_phone: string
          guest_pincode: string | null
          guest_state: string | null
          html_content: string | null
          id: string
          invoice_number: string
          nights: number
          pdf_url: string | null
          quantity: number
          rate_per_night: number
          room_name: string
          room_type: string
          status: string
          subtotal: number
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          booking_id: string
          check_in: string
          check_out: string
          created_at?: string | null
          currency?: string | null
          gst_amount: number
          gst_rate?: number
          guest_address?: string | null
          guest_city?: string | null
          guest_email: string
          guest_name: string
          guest_phone: string
          guest_pincode?: string | null
          guest_state?: string | null
          html_content?: string | null
          id?: string
          invoice_number: string
          nights: number
          pdf_url?: string | null
          quantity?: number
          rate_per_night: number
          room_name: string
          room_type: string
          status?: string
          subtotal: number
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          booking_id?: string
          check_in?: string
          check_out?: string
          created_at?: string | null
          currency?: string | null
          gst_amount?: number
          gst_rate?: number
          guest_address?: string | null
          guest_city?: string | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string
          guest_pincode?: string | null
          guest_state?: string | null
          html_content?: string | null
          id?: string
          invoice_number?: string
          nights?: number
          pdf_url?: string | null
          quantity?: number
          rate_per_night?: number
          room_name?: string
          room_type?: string
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      booking_messages: {
        Row: {
          booking_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          sender_id: string | null
          sender_name: string
          sender_type: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          sender_id?: string | null
          sender_name: string
          sender_type: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          sender_id?: string | null
          sender_name?: string
          sender_type?: string
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
          approved_at: string | null
          approved_by: string | null
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
          host_message: string | null
          id: string
          no_show_marked_at: string | null
          no_show_marked_by: string | null
          ota_booking_id: string | null
          ota_name: string | null
          payment_status: string | null
          pincode: string | null
          property_id: string | null
          quantity: number | null
          room_type: string
          room_type_id: string | null
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
          approved_at?: string | null
          approved_by?: string | null
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
          host_message?: string | null
          id?: string
          no_show_marked_at?: string | null
          no_show_marked_by?: string | null
          ota_booking_id?: string | null
          ota_name?: string | null
          payment_status?: string | null
          pincode?: string | null
          property_id?: string | null
          quantity?: number | null
          room_type: string
          room_type_id?: string | null
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
          approved_at?: string | null
          approved_by?: string | null
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
          host_message?: string | null
          id?: string
          no_show_marked_at?: string | null
          no_show_marked_by?: string | null
          ota_booking_id?: string | null
          ota_name?: string | null
          payment_status?: string | null
          pincode?: string | null
          property_id?: string | null
          quantity?: number | null
          room_type?: string
          room_type_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      demand_forecasts: {
        Row: {
          actual_demand: number | null
          actual_revenue: number | null
          confidence_score: number | null
          created_at: string | null
          demand_factors: Json | null
          demand_level: string | null
          forecast_accuracy: number | null
          forecast_date: string
          id: string
          predicted_demand: number | null
          predicted_revenue: number | null
          room_type_id: string | null
          room_type_name: string | null
          updated_at: string | null
        }
        Insert: {
          actual_demand?: number | null
          actual_revenue?: number | null
          confidence_score?: number | null
          created_at?: string | null
          demand_factors?: Json | null
          demand_level?: string | null
          forecast_accuracy?: number | null
          forecast_date: string
          id?: string
          predicted_demand?: number | null
          predicted_revenue?: number | null
          room_type_id?: string | null
          room_type_name?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_demand?: number | null
          actual_revenue?: number | null
          confidence_score?: number | null
          created_at?: string | null
          demand_factors?: Json | null
          demand_level?: string | null
          forecast_accuracy?: number | null
          forecast_date?: string
          id?: string
          predicted_demand?: number | null
          predicted_revenue?: number | null
          room_type_id?: string | null
          room_type_name?: string | null
          updated_at?: string | null
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
      edge_function_cache: {
        Row: {
          created_at: string | null
          expires_at: string
          key: string
          value: Json
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          key: string
          value: Json
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          key?: string
          value?: Json
        }
        Relationships: []
      }
      franchise_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          permissions: Json | null
          property_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          property_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          property_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_assignments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_invites: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invite_token: string
          invited_by: string | null
          is_used: boolean | null
          property_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invite_token?: string
          invited_by?: string | null
          is_used?: boolean | null
          property_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invite_token?: string
          invited_by?: string | null
          is_used?: boolean | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_invites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      ical_sync_configs: {
        Row: {
          created_at: string | null
          ical_export_token: string | null
          ical_import_url: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          last_sync_error: string | null
          last_sync_status: string | null
          ota_name: string
          property_id: string | null
          room_type_id: string
          sync_direction: string | null
          sync_frequency_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ical_export_token?: string | null
          ical_import_url?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          last_sync_error?: string | null
          last_sync_status?: string | null
          ota_name: string
          property_id?: string | null
          room_type_id: string
          sync_direction?: string | null
          sync_frequency_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ical_export_token?: string | null
          ical_import_url?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          last_sync_error?: string | null
          last_sync_status?: string | null
          ota_name?: string
          property_id?: string | null
          room_type_id?: string
          sync_direction?: string | null
          sync_frequency_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ical_sync_configs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      ical_sync_events: {
        Row: {
          config_id: string | null
          created_at: string | null
          details: Json | null
          error_message: string | null
          event_status: string
          event_type: string
          events_created: number | null
          events_deleted: number | null
          events_processed: number | null
          events_updated: number | null
          id: string
        }
        Insert: {
          config_id?: string | null
          created_at?: string | null
          details?: Json | null
          error_message?: string | null
          event_status: string
          event_type: string
          events_created?: number | null
          events_deleted?: number | null
          events_processed?: number | null
          events_updated?: number | null
          id?: string
        }
        Update: {
          config_id?: string | null
          created_at?: string | null
          details?: Json | null
          error_message?: string | null
          event_status?: string
          event_type?: string
          events_created?: number | null
          events_deleted?: number | null
          events_processed?: number | null
          events_updated?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ical_sync_events_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "ical_sync_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_counter: {
        Row: {
          counter: number
          id: string
          prefix: string
          updated_at: string | null
        }
        Insert: {
          counter?: number
          id?: string
          prefix?: string
          updated_at?: string | null
        }
        Update: {
          counter?: number
          id?: string
          prefix?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          booking_id: string | null
          cgst_amount: number | null
          cgst_rate: number | null
          created_at: string | null
          currency: string | null
          due_date: string | null
          guest_address: string | null
          guest_email: string | null
          guest_gst_number: string | null
          guest_name: string
          guest_phone: string | null
          id: string
          igst_amount: number | null
          igst_rate: number | null
          invoice_date: string | null
          invoice_number: string
          line_items: Json | null
          notes: string | null
          paid_at: string | null
          payment_terms: string | null
          pdf_url: string | null
          property_id: string | null
          sent_at: string | null
          sgst_amount: number | null
          sgst_rate: number | null
          status: string | null
          subtotal: number
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          cgst_amount?: number | null
          cgst_rate?: number | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          guest_address?: string | null
          guest_email?: string | null
          guest_gst_number?: string | null
          guest_name: string
          guest_phone?: string | null
          id?: string
          igst_amount?: number | null
          igst_rate?: number | null
          invoice_date?: string | null
          invoice_number: string
          line_items?: Json | null
          notes?: string | null
          paid_at?: string | null
          payment_terms?: string | null
          pdf_url?: string | null
          property_id?: string | null
          sent_at?: string | null
          sgst_amount?: number | null
          sgst_rate?: number | null
          status?: string | null
          subtotal: number
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          cgst_amount?: number | null
          cgst_rate?: number | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          guest_address?: string | null
          guest_email?: string | null
          guest_gst_number?: string | null
          guest_name?: string
          guest_phone?: string | null
          id?: string
          igst_amount?: number | null
          igst_rate?: number | null
          invoice_date?: string | null
          invoice_number?: string
          line_items?: Json | null
          notes?: string | null
          paid_at?: string | null
          payment_terms?: string | null
          pdf_url?: string | null
          property_id?: string | null
          sent_at?: string | null
          sgst_amount?: number | null
          sgst_rate?: number | null
          status?: string | null
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
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
      mobile_ui_logs: {
        Row: {
          component_name: string
          created_at: string
          device_pixel_ratio: number | null
          device_type: string | null
          error_message: string | null
          error_type: string
          extra_data: Json | null
          id: string
          page_url: string | null
          screen_height: number | null
          screen_width: number | null
          user_agent: string | null
          viewport_height: number | null
          viewport_width: number | null
        }
        Insert: {
          component_name: string
          created_at?: string
          device_pixel_ratio?: number | null
          device_type?: string | null
          error_message?: string | null
          error_type: string
          extra_data?: Json | null
          id?: string
          page_url?: string | null
          screen_height?: number | null
          screen_width?: number | null
          user_agent?: string | null
          viewport_height?: number | null
          viewport_width?: number | null
        }
        Update: {
          component_name?: string
          created_at?: string
          device_pixel_ratio?: number | null
          device_type?: string | null
          error_message?: string | null
          error_type?: string
          extra_data?: Json | null
          id?: string
          page_url?: string | null
          screen_height?: number | null
          screen_width?: number | null
          user_agent?: string | null
          viewport_height?: number | null
          viewport_width?: number | null
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
      pricing_rules: {
        Row: {
          adjustment_type: string
          adjustment_value: number
          created_at: string | null
          created_by: string | null
          days_of_week: number[] | null
          end_date: string | null
          id: string
          is_active: boolean | null
          max_days_advance: number | null
          max_nights: number | null
          max_occupancy_percent: number | null
          min_days_advance: number | null
          min_nights: number | null
          min_occupancy_percent: number | null
          priority: number | null
          property_id: string | null
          room_type_id: string | null
          rule_name: string
          rule_type: string
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          adjustment_type: string
          adjustment_value: number
          created_at?: string | null
          created_by?: string | null
          days_of_week?: number[] | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_days_advance?: number | null
          max_nights?: number | null
          max_occupancy_percent?: number | null
          min_days_advance?: number | null
          min_nights?: number | null
          min_occupancy_percent?: number | null
          priority?: number | null
          property_id?: string | null
          room_type_id?: string | null
          rule_name: string
          rule_type: string
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          adjustment_type?: string
          adjustment_value?: number
          created_at?: string | null
          created_by?: string | null
          days_of_week?: number[] | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_days_advance?: number | null
          max_nights?: number | null
          max_occupancy_percent?: number | null
          min_days_advance?: number | null
          min_nights?: number | null
          min_occupancy_percent?: number | null
          priority?: number | null
          property_id?: string | null
          room_type_id?: string | null
          rule_name?: string
          rule_type?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_login: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          last_login?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          gst_number: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          settings: Json | null
          slug: string
          state: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          settings?: Json | null
          slug: string
          state?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          settings?: Json | null
          slug?: string
          state?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      property_wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          pending_amount: number | null
          property_id: string
          royalty_rate: number | null
          tds_rate: number | null
          total_earnings: number | null
          total_payouts: number | null
          updated_at: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          pending_amount?: number | null
          property_id: string
          royalty_rate?: number | null
          tds_rate?: number | null
          total_earnings?: number | null
          total_payouts?: number | null
          updated_at?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          pending_amount?: number | null
          property_id?: string
          royalty_rate?: number | null
          tds_rate?: number | null
          total_earnings?: number | null
          total_payouts?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_wallets_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          p256dh: string
          updated_at: string | null
          user_id: string | null
          user_type: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          p256dh: string
          updated_at?: string | null
          user_id?: string | null
          user_type?: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          p256dh?: string
          updated_at?: string | null
          user_id?: string | null
          user_type?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          expires_at: string
          id: string
          ip_address: string
          request_count: number
          window_start: string
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          expires_at: string
          id?: string
          ip_address: string
          request_count?: number
          window_start?: string
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          expires_at?: string
          id?: string
          ip_address?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      revenue_intelligence: {
        Row: {
          avg_booking_value: number | null
          booking_count: number | null
          booking_trend: number | null
          conversion_rate: number | null
          created_at: string | null
          id: string
          new_visitors: number | null
          next_30d_forecast: number | null
          next_7d_forecast: number | null
          returning_visitors: number | null
          revenue_by_country: Json | null
          revenue_by_source: Json | null
          revenue_per_visitor: number | null
          revenue_trend: number | null
          room_type_breakdown: Json | null
          segment_breakdown: Json | null
          snapshot_date: string
          total_revenue: number | null
          total_visitors: number | null
          updated_at: string | null
        }
        Insert: {
          avg_booking_value?: number | null
          booking_count?: number | null
          booking_trend?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          new_visitors?: number | null
          next_30d_forecast?: number | null
          next_7d_forecast?: number | null
          returning_visitors?: number | null
          revenue_by_country?: Json | null
          revenue_by_source?: Json | null
          revenue_per_visitor?: number | null
          revenue_trend?: number | null
          room_type_breakdown?: Json | null
          segment_breakdown?: Json | null
          snapshot_date: string
          total_revenue?: number | null
          total_visitors?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_booking_value?: number | null
          booking_count?: number | null
          booking_trend?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          new_visitors?: number | null
          next_30d_forecast?: number | null
          next_7d_forecast?: number | null
          returning_visitors?: number | null
          revenue_by_country?: Json | null
          revenue_by_source?: Json | null
          revenue_per_visitor?: number | null
          revenue_trend?: number | null
          room_type_breakdown?: Json | null
          segment_breakdown?: Json | null
          snapshot_date?: string
          total_revenue?: number | null
          total_visitors?: number | null
          updated_at?: string | null
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
          property_id: string | null
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
          property_id?: string | null
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
          property_id?: string | null
          rating?: number
          review_text?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      room_availability_status: {
        Row: {
          admin_note: string | null
          created_at: string
          created_by: string | null
          id: string
          override_until: string | null
          room_type_id: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          override_until?: string | null
          room_type_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          override_until?: string | null
          room_type_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      room_inventory: {
        Row: {
          available_count: number
          date: string
          last_updated: string | null
          room_type_id: string
        }
        Insert: {
          available_count?: number
          date: string
          last_updated?: string | null
          room_type_id: string
        }
        Update: {
          available_count?: number
          date?: string
          last_updated?: string | null
          room_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_inventory_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          amenities: string[] | null
          base_price: number
          capacity: number
          category: string
          created_at: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          kind: string
          name: string
          property_id: string | null
          total_units: number
          updated_at: string | null
          weekday_price: number | null
          weekend_price: number | null
        }
        Insert: {
          amenities?: string[] | null
          base_price?: number
          capacity: number
          category: string
          created_at?: string | null
          id: string
          images?: string[] | null
          is_active?: boolean | null
          kind: string
          name: string
          property_id?: string | null
          total_units: number
          updated_at?: string | null
          weekday_price?: number | null
          weekend_price?: number | null
        }
        Update: {
          amenities?: string[] | null
          base_price?: number
          capacity?: number
          category?: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          kind?: string
          name?: string
          property_id?: string | null
          total_units?: number
          updated_at?: string | null
          weekday_price?: number | null
          weekend_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
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
      settlements: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          net_amount: number
          notes: string | null
          payment_reference: string | null
          property_id: string
          royalty_deducted: number | null
          settlement_date: string
          status: string | null
          tds_deducted: number | null
          updated_at: string | null
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          net_amount: number
          notes?: string | null
          payment_reference?: string | null
          property_id: string
          royalty_deducted?: number | null
          settlement_date: string
          status?: string | null
          tds_deducted?: number | null
          updated_at?: string | null
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          net_amount?: number
          notes?: string | null
          payment_reference?: string | null
          property_id?: string
          royalty_deducted?: number | null
          settlement_date?: string
          status?: string | null
          tds_deducted?: number | null
          updated_at?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settlements_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlements_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "property_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      traveller_events: {
        Row: {
          city: string | null
          country_code: string | null
          created_at: string | null
          device_type: string | null
          event_action: string | null
          event_category: string | null
          event_label: string | null
          event_type: string
          event_value: number | null
          id: string
          page_path: string | null
          properties: Json | null
          referrer: string | null
          session_id: string | null
          visitor_id: string
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          event_action?: string | null
          event_category?: string | null
          event_label?: string | null
          event_type: string
          event_value?: number | null
          id?: string
          page_path?: string | null
          properties?: Json | null
          referrer?: string | null
          session_id?: string | null
          visitor_id: string
        }
        Update: {
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          event_action?: string | null
          event_category?: string | null
          event_label?: string | null
          event_type?: string
          event_value?: number | null
          id?: string
          page_path?: string | null
          properties?: Json | null
          referrer?: string | null
          session_id?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      traveller_profiles: {
        Row: {
          avg_booking_value: number | null
          avg_session_duration: number | null
          booking_intent_score: number | null
          created_at: string | null
          first_booking_at: string | null
          first_seen_at: string | null
          first_touch_campaign: string | null
          first_touch_medium: string | null
          first_touch_source: string | null
          id: string
          is_group_organizer: boolean | null
          is_repeat_traveller: boolean | null
          is_solo_traveller: boolean | null
          last_booking_at: string | null
          last_page_viewed: string | null
          last_seen_at: string | null
          last_touch_medium: string | null
          last_touch_source: string | null
          lifetime_value: number | null
          preferred_booking_lead_days: number | null
          preferred_room_category: string | null
          preferred_season: string | null
          profile_hash: string | null
          spend_tier: string | null
          total_bookings: number | null
          total_nights: number | null
          total_pageviews: number | null
          total_sessions: number | null
          tour_interest_score: number | null
          traveller_segment: string | null
          updated_at: string | null
          visitor_id: string
        }
        Insert: {
          avg_booking_value?: number | null
          avg_session_duration?: number | null
          booking_intent_score?: number | null
          created_at?: string | null
          first_booking_at?: string | null
          first_seen_at?: string | null
          first_touch_campaign?: string | null
          first_touch_medium?: string | null
          first_touch_source?: string | null
          id?: string
          is_group_organizer?: boolean | null
          is_repeat_traveller?: boolean | null
          is_solo_traveller?: boolean | null
          last_booking_at?: string | null
          last_page_viewed?: string | null
          last_seen_at?: string | null
          last_touch_medium?: string | null
          last_touch_source?: string | null
          lifetime_value?: number | null
          preferred_booking_lead_days?: number | null
          preferred_room_category?: string | null
          preferred_season?: string | null
          profile_hash?: string | null
          spend_tier?: string | null
          total_bookings?: number | null
          total_nights?: number | null
          total_pageviews?: number | null
          total_sessions?: number | null
          tour_interest_score?: number | null
          traveller_segment?: string | null
          updated_at?: string | null
          visitor_id: string
        }
        Update: {
          avg_booking_value?: number | null
          avg_session_duration?: number | null
          booking_intent_score?: number | null
          created_at?: string | null
          first_booking_at?: string | null
          first_seen_at?: string | null
          first_touch_campaign?: string | null
          first_touch_medium?: string | null
          first_touch_source?: string | null
          id?: string
          is_group_organizer?: boolean | null
          is_repeat_traveller?: boolean | null
          is_solo_traveller?: boolean | null
          last_booking_at?: string | null
          last_page_viewed?: string | null
          last_seen_at?: string | null
          last_touch_medium?: string | null
          last_touch_source?: string | null
          lifetime_value?: number | null
          preferred_booking_lead_days?: number | null
          preferred_room_category?: string | null
          preferred_season?: string | null
          profile_hash?: string | null
          spend_tier?: string | null
          total_bookings?: number | null
          total_nights?: number | null
          total_pageviews?: number | null
          total_sessions?: number | null
          tour_interest_score?: number | null
          traveller_segment?: string | null
          updated_at?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      traveller_segments: {
        Row: {
          avg_booking_value: number | null
          avg_lifetime_value: number | null
          conversion_rate: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          segment_color: string | null
          segment_criteria: Json | null
          segment_description: string | null
          segment_key: string
          segment_name: string
          total_revenue: number | null
          traveller_count: number | null
          updated_at: string | null
        }
        Insert: {
          avg_booking_value?: number | null
          avg_lifetime_value?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          segment_color?: string | null
          segment_criteria?: Json | null
          segment_description?: string | null
          segment_key: string
          segment_name: string
          total_revenue?: number | null
          traveller_count?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_booking_value?: number | null
          avg_lifetime_value?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          segment_color?: string | null
          segment_criteria?: Json | null
          segment_description?: string | null
          segment_key?: string
          segment_name?: string
          total_revenue?: number | null
          traveller_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_location_preferences: {
        Row: {
          country_code: string
          created_at: string
          detected_at: string
          detected_currency: string
          id: string
        }
        Insert: {
          country_code: string
          created_at?: string
          detected_at?: string
          detected_currency: string
          id?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          detected_at?: string
          detected_currency?: string
          id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      webhook_events: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
          processing_attempts: number | null
          source: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          processing_attempts?: number | null
          source: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          processing_attempts?: number | null
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
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
    }
    Functions: {
      admin_block_room_date_secure:
        | {
            Args: {
              p_block_count?: number
              p_date: string
              p_room_type: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_action?: string
              p_block_count?: number
              p_date: string
              p_room_type: string
            }
            Returns: Json
          }
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
      aggregate_daily_analytics: {
        Args: { target_date?: string }
        Returns: boolean
      }
      approve_booking_and_block_inventory: {
        Args: { p_admin_id: string; p_booking_id: string }
        Returns: Json
      }
      calculate_spend_tier: { Args: { p_visitor_id: string }; Returns: string }
      check_newsletter_rate_limit: {
        Args: { p_email: string; p_ip_address?: string }
        Returns: boolean
      }
      check_suspicious_booking_activity: {
        Args: { email_param: string; time_window_hours?: number }
        Returns: {
          recent_bookings_count: number
          risk_score: number
          suspicious_indicators: string[]
        }[]
      }
      classify_traveller_segment: {
        Args: { p_visitor_id: string }
        Returns: string
      }
      cleanup_expired_cache: { Args: never; Returns: number }
      cleanup_expired_rate_limits: { Args: never; Returns: undefined }
      cleanup_rate_limits: { Args: never; Returns: undefined }
      cleanup_stale_realtime_visitors: { Args: never; Returns: number }
      create_booking_secure: {
        Args: {
          p_address?: string
          p_check_in: string
          p_check_out: string
          p_city?: string
          p_email: string
          p_emergency_contact?: string
          p_guest_name: string
          p_guests: number
          p_pincode?: string
          p_quantity: number
          p_room_type: string
          p_room_type_id: string
          p_special_requests?: string
          p_state?: string
          p_subtotal: number
          p_taxes: number
          p_total_amount: number
          p_whatsapp_number: string
        }
        Returns: Json
      }
      create_booking_with_invoice: {
        Args: {
          p_address?: string
          p_check_in: string
          p_check_out: string
          p_city?: string
          p_email: string
          p_gst_amount: number
          p_gst_rate: number
          p_guest_name: string
          p_message_to_host: string
          p_nights: number
          p_phone: string
          p_pincode?: string
          p_quantity: number
          p_rate_per_night: number
          p_room_name: string
          p_room_type: string
          p_special_requests?: string
          p_state?: string
          p_subtotal: number
          p_total_amount: number
        }
        Returns: Json
      }
      delete_my_data: { Args: never; Returns: boolean }
      export_my_data: { Args: never; Returns: Json }
      generate_booking_id: { Args: never; Returns: string }
      generate_invoice_number: { Args: never; Returns: string }
      get_analytics_overview: { Args: { days_back?: number }; Returns: Json }
      get_app_secret: { Args: { secret_name: string }; Returns: string }
      get_app_secret_secure: { Args: { secret_name: string }; Returns: string }
      get_booking_calendar: {
        Args: {
          p_end_date: string
          p_property_id?: string
          p_start_date: string
        }
        Returns: Json
      }
      get_bookings_masked_secure: {
        Args: never
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
          user_id: string
          whatsapp_number: string
        }[]
      }
      get_jwt_email: { Args: never; Returns: string }
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
        Args: never
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
      get_newsletter_stats_admin_secure: {
        Args: never
        Returns: {
          active_subscribers: number
          inactive_subscribers: number
          new_this_month: number
          new_this_week: number
          total_subscribers: number
          unique_interest_combinations: number
        }[]
      }
      get_newsletter_stats_secure: {
        Args: never
        Returns: {
          active_subscribers: number
          inactive_subscribers: number
          new_this_month: number
          new_this_week: number
          total_subscribers: number
          unique_interest_combinations: number
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
      get_room_availability_status: {
        Args: { p_room_type_id: string }
        Returns: string
      }
      get_secret_access_log_masked_secure: {
        Args: never
        Returns: {
          created_at: string
          event: string
          id: string
          ip: string
          path_preview: string
          user_agent: string
        }[]
      }
      get_security_alerts_masked_secure: {
        Args: never
        Returns: {
          created_at: string
          details: Json
          event_type: string
          id: string
          ip: string
          resolved: boolean
          resolved_by: string
          severity: string
          user_agent: string
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
      get_transactions_admin_view_secure: {
        Args: never
        Returns: {
          amount: number
          booking_id: string
          created_at: string
          currency: string
          gateway: string
          id: string
          status: string
        }[]
      }
      get_user_bookings_secure: {
        Args: never
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
      get_user_properties: { Args: { _user_id: string }; Returns: string[] }
      get_user_role: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_happy_guests: {
        Args: never
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
      increment_traveller_stats: {
        Args: { p_is_new_session?: boolean; p_visitor_id: string }
        Returns: undefined
      }
      ip_anonymize: { Args: { ip_text: string }; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_admin_email: { Args: { user_email: string }; Returns: boolean }
      is_admin_or_staff: { Args: never; Returns: boolean }
      is_franchise_for_property: {
        Args: { _property_id: string; _user_id: string }
        Returns: boolean
      }
      is_room_available: {
        Args: {
          p_check_in: string
          p_check_out: string
          p_quantity?: number
          p_room_type_id: string
        }
        Returns: boolean
      }
      log_booking_access_attempt: {
        Args: {
          p_access_type: string
          p_booking_id: string
          p_success?: boolean
        }
        Returns: undefined
      }
      log_pii_access: {
        Args: {
          p_access_type: string
          p_booking_id: string
          p_success?: boolean
        }
        Returns: undefined
      }
      log_secure_access: {
        Args: { access_granted?: boolean; function_name: string }
        Returns: undefined
      }
      mark_booking_no_show: {
        Args: { p_admin_id: string; p_booking_id: string }
        Returns: Json
      }
      norm_email: { Args: { e: string }; Returns: string }
      resolve_security_alert_admin: {
        Args: { p_alert_id: string; p_resolution_notes?: string }
        Returns: boolean
      }
      transactions_admin_secure: {
        Args: never
        Returns: {
          amount: number
          booking_id: string
          created_at: string
          currency: string
          gateway: string
          id: string
          status: string
        }[]
      }
      verify_booking_access: {
        Args: { p_booking_id: string }
        Returns: boolean
      }
      verify_booking_owner_only: {
        Args: { booking_email: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user" | "guest" | "franchise"
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
      app_role: ["admin", "staff", "user", "guest", "franchise"],
    },
  },
} as const
