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
    PostgrestVersion: "14.5"
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
      admin_security_alerts: {
        Row: {
          alert_message: string
          alert_title: string
          created_at: string
          id: string
          intrusion_log_id: string | null
          is_read: boolean | null
          read_at: string | null
          severity: string
        }
        Insert: {
          alert_message: string
          alert_title: string
          created_at?: string
          id?: string
          intrusion_log_id?: string | null
          is_read?: boolean | null
          read_at?: string | null
          severity?: string
        }
        Update: {
          alert_message?: string
          alert_title?: string
          created_at?: string
          id?: string
          intrusion_log_id?: string | null
          is_read?: boolean | null
          read_at?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_security_alerts_intrusion_log_id_fkey"
            columns: ["intrusion_log_id"]
            isOneToOne: false
            referencedRelation: "security_intrusion_logs"
            referencedColumns: ["id"]
          },
        ]
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
      analytics_loader_events: {
        Row: {
          analytics_consent: boolean | null
          attempts: number | null
          block_reason: string | null
          browser: string | null
          consent_source: string | null
          created_at: string
          device_type: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          online: boolean | null
          page_path: string | null
          source_url: string | null
          status: string
          tag: string
          used_first_party: boolean | null
          user_agent: string | null
        }
        Insert: {
          analytics_consent?: boolean | null
          attempts?: number | null
          block_reason?: string | null
          browser?: string | null
          consent_source?: string | null
          created_at?: string
          device_type?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          online?: boolean | null
          page_path?: string | null
          source_url?: string | null
          status: string
          tag?: string
          used_first_party?: boolean | null
          user_agent?: string | null
        }
        Update: {
          analytics_consent?: boolean | null
          attempts?: number | null
          block_reason?: string | null
          browser?: string | null
          consent_source?: string | null
          created_at?: string
          device_type?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          online?: boolean | null
          page_path?: string | null
          source_url?: string | null
          status?: string
          tag?: string
          used_first_party?: boolean | null
          user_agent?: string | null
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
      analytics_visitors_detailed: {
        Row: {
          created_at: string | null
          device_browser: string | null
          device_category: string | null
          device_os: string | null
          event_action: string | null
          event_category: string | null
          event_label: string | null
          event_value: number | null
          geo_city: string | null
          geo_country: string | null
          geo_region: string | null
          hit_timestamp: string | null
          hit_type: string | null
          id: string
          is_entrance: boolean | null
          is_exit: boolean | null
          page_path: string | null
          page_title: string | null
          scroll_depth: number | null
          session_id: string
          time_on_page: number | null
          traffic_campaign: string | null
          traffic_medium: string | null
          traffic_source: string | null
          transaction_id: string | null
          transaction_revenue: number | null
          visitor_id: string
        }
        Insert: {
          created_at?: string | null
          device_browser?: string | null
          device_category?: string | null
          device_os?: string | null
          event_action?: string | null
          event_category?: string | null
          event_label?: string | null
          event_value?: number | null
          geo_city?: string | null
          geo_country?: string | null
          geo_region?: string | null
          hit_timestamp?: string | null
          hit_type?: string | null
          id?: string
          is_entrance?: boolean | null
          is_exit?: boolean | null
          page_path?: string | null
          page_title?: string | null
          scroll_depth?: number | null
          session_id: string
          time_on_page?: number | null
          traffic_campaign?: string | null
          traffic_medium?: string | null
          traffic_source?: string | null
          transaction_id?: string | null
          transaction_revenue?: number | null
          visitor_id: string
        }
        Update: {
          created_at?: string | null
          device_browser?: string | null
          device_category?: string | null
          device_os?: string | null
          event_action?: string | null
          event_category?: string | null
          event_label?: string | null
          event_value?: number | null
          geo_city?: string | null
          geo_country?: string | null
          geo_region?: string | null
          hit_timestamp?: string | null
          hit_type?: string | null
          id?: string
          is_entrance?: boolean | null
          is_exit?: boolean | null
          page_path?: string | null
          page_title?: string | null
          scroll_depth?: number | null
          session_id?: string
          time_on_page?: number | null
          traffic_campaign?: string | null
          traffic_medium?: string | null
          traffic_source?: string | null
          transaction_id?: string | null
          transaction_revenue?: number | null
          visitor_id?: string
        }
        Relationships: []
      }
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
      audit_logs: {
        Row: {
          action: string
          actor_role: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          is_rollback: boolean | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          property_id: string | null
          record_id: string | null
          rollback_of: string | null
          snapshot_type: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          actor_role?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          is_rollback?: boolean | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          property_id?: string | null
          record_id?: string | null
          rollback_of?: string | null
          snapshot_type?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          actor_role?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          is_rollback?: boolean | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          property_id?: string | null
          record_id?: string | null
          rollback_of?: string | null
          snapshot_type?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_rollback_of_fkey"
            columns: ["rollback_of"]
            isOneToOne: false
            referencedRelation: "audit_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_dates: {
        Row: {
          blocked: boolean
          created_at: string
          date: string
          id: string
          property_id: string | null
          room_type: string
        }
        Insert: {
          blocked?: boolean
          created_at?: string
          date: string
          id?: string
          property_id?: string | null
          room_type: string
        }
        Update: {
          blocked?: boolean
          created_at?: string
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
          {
            foreignKeyName: "blocked_dates_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_audit_log: {
        Row: {
          accessed_fields: string[] | null
          action_type: string
          booking_id: string | null
          created_at: string | null
          id: string
          user_agent: string | null
          user_email: string | null
          user_ip: unknown
        }
        Insert: {
          accessed_fields?: string[] | null
          action_type: string
          booking_id?: string | null
          created_at?: string | null
          id?: string
          user_agent?: string | null
          user_email?: string | null
          user_ip?: unknown
        }
        Update: {
          accessed_fields?: string[] | null
          action_type?: string
          booking_id?: string | null
          created_at?: string | null
          id?: string
          user_agent?: string | null
          user_email?: string | null
          user_ip?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "booking_audit_log_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_channels: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
        }
        Relationships: []
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
      booking_rate_limits: {
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
      booking_settlement_history: {
        Row: {
          actor_id: string | null
          actor_role: string | null
          amount: number | null
          booking_id: string
          booking_reference: string
          created_at: string
          id: string
          new_status: string
          notes: string | null
          previous_status: string | null
        }
        Insert: {
          actor_id?: string | null
          actor_role?: string | null
          amount?: number | null
          booking_id: string
          booking_reference: string
          created_at?: string
          id?: string
          new_status: string
          notes?: string | null
          previous_status?: string | null
        }
        Update: {
          actor_id?: string | null
          actor_role?: string | null
          amount?: number | null
          booking_id?: string
          booking_reference?: string
          created_at?: string
          id?: string
          new_status?: string
          notes?: string | null
          previous_status?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          address: string | null
          approved_at: string | null
          approved_by: string | null
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
          host_message: string | null
          id: string
          invoice_generated: boolean | null
          invoice_url: string | null
          nights: number
          no_show_marked_at: string | null
          no_show_marked_by: string | null
          ota_booking_id: string | null
          ota_name: string | null
          payment_method: string | null
          payment_status: string | null
          payment_verified_at: string | null
          payout_eligible: boolean | null
          payout_released_at: string | null
          pincode: string | null
          promo_applied: boolean | null
          promo_code: string | null
          property_id: string | null
          quantity: number | null
          refund_amount: number | null
          room_details: Json
          room_type: string | null
          room_type_id: string | null
          settled_at: string | null
          settled_by: string | null
          settlement_amount: number | null
          settlement_status: string | null
          source: string | null
          special_requests: string | null
          state: string | null
          subtotal: number
          taxes: number | null
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
          host_message?: string | null
          id?: string
          invoice_generated?: boolean | null
          invoice_url?: string | null
          nights: number
          no_show_marked_at?: string | null
          no_show_marked_by?: string | null
          ota_booking_id?: string | null
          ota_name?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payment_verified_at?: string | null
          payout_eligible?: boolean | null
          payout_released_at?: string | null
          pincode?: string | null
          promo_applied?: boolean | null
          promo_code?: string | null
          property_id?: string | null
          quantity?: number | null
          refund_amount?: number | null
          room_details: Json
          room_type?: string | null
          room_type_id?: string | null
          settled_at?: string | null
          settled_by?: string | null
          settlement_amount?: number | null
          settlement_status?: string | null
          source?: string | null
          special_requests?: string | null
          state?: string | null
          subtotal: number
          taxes?: number | null
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
          host_message?: string | null
          id?: string
          invoice_generated?: boolean | null
          invoice_url?: string | null
          nights?: number
          no_show_marked_at?: string | null
          no_show_marked_by?: string | null
          ota_booking_id?: string | null
          ota_name?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payment_verified_at?: string | null
          payout_eligible?: boolean | null
          payout_released_at?: string | null
          pincode?: string | null
          promo_applied?: boolean | null
          promo_code?: string | null
          property_id?: string | null
          quantity?: number | null
          refund_amount?: number | null
          room_details?: Json
          room_type?: string | null
          room_type_id?: string | null
          settled_at?: string | null
          settled_by?: string | null
          settlement_amount?: number | null
          settlement_status?: string | null
          source?: string | null
          special_requests?: string | null
          state?: string | null
          subtotal?: number
          taxes?: number | null
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
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_detection_logs: {
        Row: {
          action_taken: string | null
          created_at: string | null
          detection_score: number | null
          detection_signals: Json | null
          detection_type: string
          id: string
          is_confirmed_bot: boolean | null
          session_id: string | null
          visitor_id: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          detection_score?: number | null
          detection_signals?: Json | null
          detection_type: string
          id?: string
          is_confirmed_bot?: boolean | null
          session_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          detection_score?: number | null
          detection_signals?: Json | null
          detection_type?: string
          id?: string
          is_confirmed_bot?: boolean | null
          session_id?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      catering_enquiries: {
        Row: {
          created_at: string
          cuisine_preferences: string | null
          email: string | null
          event_date: string | null
          event_type: string
          full_name: string
          guest_count: number | null
          id: string
          message: string | null
          phone: string
          status: string
        }
        Insert: {
          created_at?: string
          cuisine_preferences?: string | null
          email?: string | null
          event_date?: string | null
          event_type: string
          full_name: string
          guest_count?: number | null
          id?: string
          message?: string | null
          phone: string
          status?: string
        }
        Update: {
          created_at?: string
          cuisine_preferences?: string | null
          email?: string | null
          event_date?: string | null
          event_type?: string
          full_name?: string
          guest_count?: number | null
          id?: string
          message?: string | null
          phone?: string
          status?: string
        }
        Relationships: []
      }
      channel_strategy: {
        Row: {
          avg_lead_time_days: number | null
          blackout_dates: Json | null
          cancellation_count: number | null
          cancellation_rate: number | null
          channel_name: string
          conversion_rate: number | null
          created_at: string
          created_by: string | null
          health_factors: Json | null
          health_score: number | null
          id: string
          inventory_cap_percent: number | null
          inventory_cap_units: number | null
          is_active: boolean | null
          last_parity_check: string | null
          last_sync_at: string | null
          max_rate: number | null
          min_rate: number | null
          parity_check_enabled: boolean | null
          parity_violations: Json | null
          property_id: string
          rate_modifier_type: string | null
          rate_modifier_value: number | null
          sync_error: string | null
          sync_status: string | null
          total_bookings: number | null
          total_revenue: number | null
          updated_at: string
        }
        Insert: {
          avg_lead_time_days?: number | null
          blackout_dates?: Json | null
          cancellation_count?: number | null
          cancellation_rate?: number | null
          channel_name: string
          conversion_rate?: number | null
          created_at?: string
          created_by?: string | null
          health_factors?: Json | null
          health_score?: number | null
          id?: string
          inventory_cap_percent?: number | null
          inventory_cap_units?: number | null
          is_active?: boolean | null
          last_parity_check?: string | null
          last_sync_at?: string | null
          max_rate?: number | null
          min_rate?: number | null
          parity_check_enabled?: boolean | null
          parity_violations?: Json | null
          property_id: string
          rate_modifier_type?: string | null
          rate_modifier_value?: number | null
          sync_error?: string | null
          sync_status?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Update: {
          avg_lead_time_days?: number | null
          blackout_dates?: Json | null
          cancellation_count?: number | null
          cancellation_rate?: number | null
          channel_name?: string
          conversion_rate?: number | null
          created_at?: string
          created_by?: string | null
          health_factors?: Json | null
          health_score?: number | null
          id?: string
          inventory_cap_percent?: number | null
          inventory_cap_units?: number | null
          is_active?: boolean | null
          last_parity_check?: string | null
          last_sync_at?: string | null
          max_rate?: number | null
          min_rate?: number | null
          parity_check_enabled?: boolean | null
          parity_violations?: Json | null
          property_id?: string
          rate_modifier_type?: string | null
          rate_modifier_value?: number | null
          sync_error?: string | null
          sync_status?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string
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
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          session_id: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          session_id?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      consent_records: {
        Row: {
          ad_personalization: boolean | null
          ad_storage: boolean | null
          ad_user_data: boolean | null
          analytics_storage: boolean | null
          consent_method: string | null
          consent_version: string | null
          created_at: string | null
          functionality_storage: boolean | null
          granted_at: string | null
          id: string
          ip_hash: string | null
          revoked_at: string | null
          security_storage: boolean | null
          session_id: string | null
          updated_at: string | null
          user_agent: string | null
          visitor_id: string
        }
        Insert: {
          ad_personalization?: boolean | null
          ad_storage?: boolean | null
          ad_user_data?: boolean | null
          analytics_storage?: boolean | null
          consent_method?: string | null
          consent_version?: string | null
          created_at?: string | null
          functionality_storage?: boolean | null
          granted_at?: string | null
          id?: string
          ip_hash?: string | null
          revoked_at?: string | null
          security_storage?: boolean | null
          session_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          visitor_id: string
        }
        Update: {
          ad_personalization?: boolean | null
          ad_storage?: boolean | null
          ad_user_data?: boolean | null
          analytics_storage?: boolean | null
          consent_method?: string | null
          consent_version?: string | null
          created_at?: string | null
          functionality_storage?: boolean | null
          granted_at?: string | null
          id?: string
          ip_hash?: string | null
          revoked_at?: string | null
          security_storage?: boolean | null
          session_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          visitor_id?: string
        }
        Relationships: []
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
      demand_signals: {
        Row: {
          action_notes: string | null
          action_taken: boolean | null
          action_taken_at: string | null
          action_taken_by: string | null
          action_type: string | null
          avg_lead_time_days: number | null
          best_performing_channel: string | null
          booking_velocity_trend: string | null
          bookings_last_24h: number | null
          bookings_last_7d: number | null
          confidence_level: string | null
          confidence_score: number | null
          created_at: string
          direct_booking_ratio: number | null
          id: string
          lead_time_compression: boolean | null
          occupancy_14d: number | null
          occupancy_30d: number | null
          occupancy_7d: number | null
          occupancy_delta_7d: number | null
          ota_booking_ratio: number | null
          property_id: string
          room_type_id: string | null
          signal_date: string
          suggested_action: string | null
          updated_at: string
          weekday_occupancy: number | null
          weekend_occupancy: number | null
          weekend_rate_premium: number | null
        }
        Insert: {
          action_notes?: string | null
          action_taken?: boolean | null
          action_taken_at?: string | null
          action_taken_by?: string | null
          action_type?: string | null
          avg_lead_time_days?: number | null
          best_performing_channel?: string | null
          booking_velocity_trend?: string | null
          bookings_last_24h?: number | null
          bookings_last_7d?: number | null
          confidence_level?: string | null
          confidence_score?: number | null
          created_at?: string
          direct_booking_ratio?: number | null
          id?: string
          lead_time_compression?: boolean | null
          occupancy_14d?: number | null
          occupancy_30d?: number | null
          occupancy_7d?: number | null
          occupancy_delta_7d?: number | null
          ota_booking_ratio?: number | null
          property_id: string
          room_type_id?: string | null
          signal_date: string
          suggested_action?: string | null
          updated_at?: string
          weekday_occupancy?: number | null
          weekend_occupancy?: number | null
          weekend_rate_premium?: number | null
        }
        Update: {
          action_notes?: string | null
          action_taken?: boolean | null
          action_taken_at?: string | null
          action_taken_by?: string | null
          action_type?: string | null
          avg_lead_time_days?: number | null
          best_performing_channel?: string | null
          booking_velocity_trend?: string | null
          bookings_last_24h?: number | null
          bookings_last_7d?: number | null
          confidence_level?: string | null
          confidence_score?: number | null
          created_at?: string
          direct_booking_ratio?: number | null
          id?: string
          lead_time_compression?: boolean | null
          occupancy_14d?: number | null
          occupancy_30d?: number | null
          occupancy_7d?: number | null
          occupancy_delta_7d?: number | null
          ota_booking_ratio?: number | null
          property_id?: string
          room_type_id?: string | null
          signal_date?: string
          suggested_action?: string | null
          updated_at?: string
          weekday_occupancy?: number | null
          weekend_occupancy?: number | null
          weekend_rate_premium?: number | null
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
      dpdp_consents: {
        Row: {
          consent_type: string
          consent_version: string | null
          created_at: string | null
          granted: boolean | null
          granted_at: string | null
          id: string
          ip_address: string | null
          revoked_at: string | null
          user_agent: string | null
          visitor_id: string
        }
        Insert: {
          consent_type: string
          consent_version?: string | null
          created_at?: string | null
          granted?: boolean | null
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          revoked_at?: string | null
          user_agent?: string | null
          visitor_id: string
        }
        Update: {
          consent_type?: string
          consent_version?: string | null
          created_at?: string | null
          granted?: boolean | null
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          revoked_at?: string | null
          user_agent?: string | null
          visitor_id?: string
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
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          check_in: string
          check_out: string
          created_at: string
          email: string
          enquiry_id: string
          gst_amount: number
          gst_rate: number
          guest_address: string | null
          guest_city: string | null
          guest_name: string
          guest_pincode: string | null
          guest_state: string | null
          id: string
          nights: number
          phone: string
          quantity: number
          rate_per_night: number
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          room_name: string
          room_type: string
          special_requests: string | null
          status: string
          subtotal: number
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          check_in: string
          check_out: string
          created_at?: string
          email: string
          enquiry_id: string
          gst_amount: number
          gst_rate?: number
          guest_address?: string | null
          guest_city?: string | null
          guest_name: string
          guest_pincode?: string | null
          guest_state?: string | null
          id?: string
          nights: number
          phone: string
          quantity?: number
          rate_per_night: number
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          room_name: string
          room_type: string
          special_requests?: string | null
          status?: string
          subtotal: number
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          check_in?: string
          check_out?: string
          created_at?: string
          email?: string
          enquiry_id?: string
          gst_amount?: number
          gst_rate?: number
          guest_address?: string | null
          guest_city?: string | null
          guest_name?: string
          guest_pincode?: string | null
          guest_state?: string | null
          id?: string
          nights?: number
          phone?: string
          quantity?: number
          rate_per_night?: number
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          room_name?: string
          room_type?: string
          special_requests?: string | null
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
          user_id?: string | null
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
          {
            foreignKeyName: "franchise_assignments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
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
          {
            foreignKeyName: "franchise_invites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
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
          {
            foreignKeyName: "ical_sync_configs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
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
      idempotency_keys: {
        Row: {
          booking_id: string | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          expires_at: string
          id: string
          idempotency_key: string
          last_retry_at: string | null
          operation_type: string
          payment_id: string | null
          property_id: string | null
          request_hash: string | null
          result: Json | null
          retry_count: number | null
          status: string
        }
        Insert: {
          booking_id?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          expires_at?: string
          id?: string
          idempotency_key: string
          last_retry_at?: string | null
          operation_type: string
          payment_id?: string | null
          property_id?: string | null
          request_hash?: string | null
          result?: Json | null
          retry_count?: number | null
          status?: string
        }
        Update: {
          booking_id?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          expires_at?: string
          id?: string
          idempotency_key?: string
          last_retry_at?: string | null
          operation_type?: string
          payment_id?: string | null
          property_id?: string | null
          request_hash?: string | null
          result?: Json | null
          retry_count?: number | null
          status?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          available_units: number
          created_at: string | null
          date: string
          id: string
          max_rate: number | null
          min_rate: number | null
          rate: number
          room_type_id: string | null
          stop_sale: boolean | null
          total_units: number
          updated_at: string | null
        }
        Insert: {
          available_units?: number
          created_at?: string | null
          date: string
          id?: string
          max_rate?: number | null
          min_rate?: number | null
          rate: number
          room_type_id?: string | null
          stop_sale?: boolean | null
          total_units?: number
          updated_at?: string | null
        }
        Update: {
          available_units?: number
          created_at?: string | null
          date?: string
          id?: string
          max_rate?: number | null
          min_rate?: number | null
          rate?: number
          room_type_id?: string | null
          stop_sale?: boolean | null
          total_units?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_bulk_operations: {
        Row: {
          applied_at: string | null
          applied_by: string | null
          dates_affected: string[]
          id: string
          new_values: Json
          notes: string | null
          old_values: Json | null
          operation_type: string
          property_type: string | null
          room_type_id: string
        }
        Insert: {
          applied_at?: string | null
          applied_by?: string | null
          dates_affected: string[]
          id?: string
          new_values: Json
          notes?: string | null
          old_values?: Json | null
          operation_type: string
          property_type?: string | null
          room_type_id: string
        }
        Update: {
          applied_at?: string | null
          applied_by?: string | null
          dates_affected?: string[]
          id?: string
          new_values?: Json
          notes?: string | null
          old_values?: Json | null
          operation_type?: string
          property_type?: string | null
          room_type_id?: string
        }
        Relationships: []
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
          {
            foreignKeyName: "invoices_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
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
          id: string
          key: string
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
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
      ota_availability_cache: {
        Row: {
          available: number
          cache_date: string
          cached_at: string
          id: string
          is_blocked: boolean | null
          is_sold_out: boolean | null
          room_type_id: string | null
          room_type_name: string
          total: number
        }
        Insert: {
          available?: number
          cache_date: string
          cached_at?: string
          id?: string
          is_blocked?: boolean | null
          is_sold_out?: boolean | null
          room_type_id?: string | null
          room_type_name: string
          total?: number
        }
        Update: {
          available?: number
          cache_date?: string
          cached_at?: string
          id?: string
          is_blocked?: boolean | null
          is_sold_out?: boolean | null
          room_type_id?: string | null
          room_type_name?: string
          total?: number
        }
        Relationships: []
      }
      ota_connections: {
        Row: {
          api_key: string | null
          channel_name: string
          channel_type: string | null
          commission_rate: number | null
          created_at: string | null
          id: string
          is_connected: boolean | null
          last_sync_at: string | null
          property_code: string | null
          property_id: string | null
          rate_parity_enabled: boolean | null
          settings: Json | null
          sync_error: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          channel_name: string
          channel_type?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          property_code?: string | null
          property_id?: string | null
          rate_parity_enabled?: boolean | null
          settings?: Json | null
          sync_error?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          channel_name?: string
          channel_type?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          property_code?: string | null
          property_id?: string | null
          rate_parity_enabled?: boolean | null
          settings?: Json | null
          sync_error?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ota_connections_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ota_connections_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      ota_integrations: {
        Row: {
          api_key: string | null
          api_secret: string | null
          commission_rate: number | null
          created_at: string | null
          endpoint_url: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          mapping_config: Json | null
          ota_name: string
          sync_inventory: boolean | null
          sync_rates: boolean | null
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          commission_rate?: number | null
          created_at?: string | null
          endpoint_url?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          mapping_config?: Json | null
          ota_name: string
          sync_inventory?: boolean | null
          sync_rates?: boolean | null
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          commission_rate?: number | null
          created_at?: string | null
          endpoint_url?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          mapping_config?: Json | null
          ota_name?: string
          sync_inventory?: boolean | null
          sync_rates?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      password_reset_otp: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          otp_code: string
          used: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          otp_code: string
          used?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          otp_code?: string
          used?: boolean | null
          user_id?: string | null
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
          {
            foreignKeyName: "pricing_rules_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          phone?: string | null
          updated_at?: string | null
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
      property_inventory_settings: {
        Row: {
          auto_price_adjustment: boolean | null
          bulk_operations_enabled: boolean | null
          created_at: string | null
          date_blocking_enabled: boolean | null
          default_pricing_enabled: boolean | null
          id: string
          low_inventory_threshold: number | null
          property_id: string | null
          property_type: string
          seasonal_pricing_enabled: boolean | null
          settings_json: Json | null
          updated_at: string | null
          weekend_rate_multiplier: number | null
        }
        Insert: {
          auto_price_adjustment?: boolean | null
          bulk_operations_enabled?: boolean | null
          created_at?: string | null
          date_blocking_enabled?: boolean | null
          default_pricing_enabled?: boolean | null
          id?: string
          low_inventory_threshold?: number | null
          property_id?: string | null
          property_type: string
          seasonal_pricing_enabled?: boolean | null
          settings_json?: Json | null
          updated_at?: string | null
          weekend_rate_multiplier?: number | null
        }
        Update: {
          auto_price_adjustment?: boolean | null
          bulk_operations_enabled?: boolean | null
          created_at?: string | null
          date_blocking_enabled?: boolean | null
          default_pricing_enabled?: boolean | null
          id?: string
          low_inventory_threshold?: number | null
          property_id?: string | null
          property_type?: string
          seasonal_pricing_enabled?: boolean | null
          settings_json?: Json | null
          updated_at?: string | null
          weekend_rate_multiplier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_inventory_settings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_inventory_settings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_onboarding: {
        Row: {
          base_rates_generated: boolean | null
          blocking_issues: Json | null
          checklist: Json | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          default_policies_applied: boolean | null
          first_booking_at: string | null
          id: string
          inventory_scaffolded: boolean | null
          minimum_readiness_met: boolean | null
          onboarding_status: string | null
          property_id: string
          property_type: string
          readiness_factors: Json | null
          readiness_score: number | null
          started_at: string | null
          template_applied: string | null
          updated_at: string
          warnings: Json | null
        }
        Insert: {
          base_rates_generated?: boolean | null
          blocking_issues?: Json | null
          checklist?: Json | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          default_policies_applied?: boolean | null
          first_booking_at?: string | null
          id?: string
          inventory_scaffolded?: boolean | null
          minimum_readiness_met?: boolean | null
          onboarding_status?: string | null
          property_id: string
          property_type?: string
          readiness_factors?: Json | null
          readiness_score?: number | null
          started_at?: string | null
          template_applied?: string | null
          updated_at?: string
          warnings?: Json | null
        }
        Update: {
          base_rates_generated?: boolean | null
          blocking_issues?: Json | null
          checklist?: Json | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          default_policies_applied?: boolean | null
          first_booking_at?: string | null
          id?: string
          inventory_scaffolded?: boolean | null
          minimum_readiness_met?: boolean | null
          onboarding_status?: string | null
          property_id?: string
          property_type?: string
          readiness_factors?: Json | null
          readiness_score?: number | null
          started_at?: string | null
          template_applied?: string | null
          updated_at?: string
          warnings?: Json | null
        }
        Relationships: []
      }
      property_room_types: {
        Row: {
          amenities: Json | null
          base_price: number
          bed_configuration: string | null
          category: string | null
          created_at: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          max_guests: number | null
          name: string
          property_id: string | null
          short_name: string | null
          sort_order: number | null
          total_units: number | null
          updated_at: string | null
        }
        Insert: {
          amenities?: Json | null
          base_price: number
          bed_configuration?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          max_guests?: number | null
          name: string
          property_id?: string | null
          short_name?: string | null
          sort_order?: number | null
          total_units?: number | null
          updated_at?: string | null
        }
        Update: {
          amenities?: Json | null
          base_price?: number
          bed_configuration?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          max_guests?: number | null
          name?: string
          property_id?: string | null
          short_name?: string | null
          sort_order?: number | null
          total_units?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_templates: {
        Row: {
          created_at: string
          default_base_rates: Json | null
          default_holiday_markup: number | null
          default_inventory_days: number | null
          default_policies: Json | null
          default_room_types: Json
          default_weekend_markup: number | null
          description: string | null
          id: string
          is_active: boolean | null
          property_type: string
          template_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_base_rates?: Json | null
          default_holiday_markup?: number | null
          default_inventory_days?: number | null
          default_policies?: Json | null
          default_room_types?: Json
          default_weekend_markup?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          property_type: string
          template_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_base_rates?: Json | null
          default_holiday_markup?: number | null
          default_inventory_days?: number | null
          default_policies?: Json | null
          default_room_types?: Json
          default_weekend_markup?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          property_type?: string
          template_name?: string
          updated_at?: string
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
          {
            foreignKeyName: "property_wallets_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "public_properties"
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
          user_id: string
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
          user_id: string
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
          user_id?: string
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
      restaurant_reviews: {
        Row: {
          approved: boolean
          created_at: string
          guest_name: string
          id: string
          local_guide: boolean
          owner_reply: string | null
          photos: string[] | null
          price_range: string | null
          rating: number
          review_text: string | null
          source: string
          verified: boolean
          visit_type: string | null
        }
        Insert: {
          approved?: boolean
          created_at?: string
          guest_name: string
          id?: string
          local_guide?: boolean
          owner_reply?: string | null
          photos?: string[] | null
          price_range?: string | null
          rating: number
          review_text?: string | null
          source?: string
          verified?: boolean
          visit_type?: string | null
        }
        Update: {
          approved?: boolean
          created_at?: string
          guest_name?: string
          id?: string
          local_guide?: boolean
          owner_reply?: string | null
          photos?: string[] | null
          price_range?: string | null
          rating?: number
          review_text?: string | null
          source?: string
          verified?: boolean
          visit_type?: string | null
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
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
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
          created_at: string
          date: string
          id: string
          last_updated: string | null
          room_type_id: string | null
          total_count: number
          updated_at: string
        }
        Insert: {
          available_count?: number
          created_at?: string
          date: string
          id?: string
          last_updated?: string | null
          room_type_id?: string | null
          total_count?: number
          updated_at?: string
        }
        Update: {
          available_count?: number
          created_at?: string
          date?: string
          id?: string
          last_updated?: string | null
          room_type_id?: string | null
          total_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      room_types: {
        Row: {
          amenities: Json | null
          base_price: number
          capacity: number
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          name: string
          property_id: string | null
          total_units: number | null
          updated_at: string | null
          weekday_price: number | null
          weekend_price: number | null
        }
        Insert: {
          amenities?: Json | null
          base_price: number
          capacity: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          name: string
          property_id?: string | null
          total_units?: number | null
          updated_at?: string | null
          weekday_price?: number | null
          weekend_price?: number | null
        }
        Update: {
          amenities?: Json | null
          base_price?: number
          capacity?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          name?: string
          property_id?: string | null
          total_units?: number | null
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
          {
            foreignKeyName: "room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      route_performance_metrics: {
        Row: {
          cls_score: number | null
          connection_type: string | null
          created_at: string
          deploy_version: string | null
          device_type: string | null
          fcp_ms: number | null
          gtm_loaded: boolean | null
          id: string
          inp_ms: number | null
          is_returning_visitor: boolean | null
          lcp_ms: number | null
          long_tasks_count: number | null
          metric_date: string
          route: string
          seo_jsonld_size: number | null
          skeleton_dismissed: boolean | null
          tbt_ms: number | null
          ttfb_ms: number | null
          user_agent: string | null
          visit_number: number | null
          visitor_id: string | null
        }
        Insert: {
          cls_score?: number | null
          connection_type?: string | null
          created_at?: string
          deploy_version?: string | null
          device_type?: string | null
          fcp_ms?: number | null
          gtm_loaded?: boolean | null
          id?: string
          inp_ms?: number | null
          is_returning_visitor?: boolean | null
          lcp_ms?: number | null
          long_tasks_count?: number | null
          metric_date?: string
          route: string
          seo_jsonld_size?: number | null
          skeleton_dismissed?: boolean | null
          tbt_ms?: number | null
          ttfb_ms?: number | null
          user_agent?: string | null
          visit_number?: number | null
          visitor_id?: string | null
        }
        Update: {
          cls_score?: number | null
          connection_type?: string | null
          created_at?: string
          deploy_version?: string | null
          device_type?: string | null
          fcp_ms?: number | null
          gtm_loaded?: boolean | null
          id?: string
          inp_ms?: number | null
          is_returning_visitor?: boolean | null
          lcp_ms?: number | null
          long_tasks_count?: number | null
          metric_date?: string
          route?: string
          seo_jsonld_size?: number | null
          skeleton_dismissed?: boolean | null
          tbt_ms?: number | null
          ttfb_ms?: number | null
          user_agent?: string | null
          visit_number?: number | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      search_queries: {
        Row: {
          clicked_result_title: string | null
          clicked_result_url: string | null
          country_code: string | null
          created_at: string
          device_type: string | null
          id: string
          page_path: string | null
          query: string
          query_normalized: string | null
          result_count: number | null
          session_id: string | null
          source: string | null
          user_agent: string | null
          visitor_id: string | null
          zero_results: boolean | null
        }
        Insert: {
          clicked_result_title?: string | null
          clicked_result_url?: string | null
          country_code?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          page_path?: string | null
          query: string
          query_normalized?: string | null
          result_count?: number | null
          session_id?: string | null
          source?: string | null
          user_agent?: string | null
          visitor_id?: string | null
          zero_results?: boolean | null
        }
        Update: {
          clicked_result_title?: string | null
          clicked_result_url?: string | null
          country_code?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          page_path?: string | null
          query?: string
          query_normalized?: string | null
          result_count?: number | null
          session_id?: string | null
          source?: string | null
          user_agent?: string | null
          visitor_id?: string | null
          zero_results?: boolean | null
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
      security_intrusion_logs: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          attempt_details: Json | null
          created_at: string
          device_fingerprint: string | null
          device_info: Json | null
          email: string | null
          event_type: string
          geo_location: Json | null
          id: string
          ip_address: string | null
          is_acknowledged: boolean | null
          severity: string
          user_agent: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          attempt_details?: Json | null
          created_at?: string
          device_fingerprint?: string | null
          device_info?: Json | null
          email?: string | null
          event_type: string
          geo_location?: Json | null
          id?: string
          ip_address?: string | null
          is_acknowledged?: boolean | null
          severity?: string
          user_agent?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          attempt_details?: Json | null
          created_at?: string
          device_fingerprint?: string | null
          device_info?: Json | null
          email?: string | null
          event_type?: string
          geo_location?: Json | null
          id?: string
          ip_address?: string | null
          is_acknowledged?: boolean | null
          severity?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      seo_coverage_status: {
        Row: {
          crawl_request_count: number
          created_at: string
          current_status: string
          gsc_status: string | null
          http_status: number | null
          id: string
          last_checked_at: string | null
          last_crawl_requested_at: string | null
          last_indexed_at: string | null
          notes: string | null
          resolution_type: string | null
          target_path: string | null
          updated_at: string
          url_path: string
        }
        Insert: {
          crawl_request_count?: number
          created_at?: string
          current_status?: string
          gsc_status?: string | null
          http_status?: number | null
          id?: string
          last_checked_at?: string | null
          last_crawl_requested_at?: string | null
          last_indexed_at?: string | null
          notes?: string | null
          resolution_type?: string | null
          target_path?: string | null
          updated_at?: string
          url_path: string
        }
        Update: {
          crawl_request_count?: number
          created_at?: string
          current_status?: string
          gsc_status?: string | null
          http_status?: number | null
          id?: string
          last_checked_at?: string | null
          last_crawl_requested_at?: string | null
          last_indexed_at?: string | null
          notes?: string | null
          resolution_type?: string | null
          target_path?: string | null
          updated_at?: string
          url_path?: string
        }
        Relationships: []
      }
      seo_crawl_requests: {
        Row: {
          created_at: string
          id: string
          provider: string
          requested_by: string | null
          response_body: string | null
          response_code: number | null
          status: string
          url_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          provider: string
          requested_by?: string | null
          response_body?: string | null
          response_code?: number | null
          status?: string
          url_path: string
        }
        Update: {
          created_at?: string
          id?: string
          provider?: string
          requested_by?: string | null
          response_body?: string | null
          response_code?: number | null
          status?: string
          url_path?: string
        }
        Relationships: []
      }
      seo_position_snapshots: {
        Row: {
          captured_at: string
          cpc: number | null
          database: string
          delta: number | null
          id: string
          is_programmatic: boolean
          is_striking_distance: boolean
          keyword: string
          position: number
          previous_position: number | null
          run_id: string
          traffic_pct: number | null
          url: string | null
          volume: number | null
        }
        Insert: {
          captured_at?: string
          cpc?: number | null
          database?: string
          delta?: number | null
          id?: string
          is_programmatic?: boolean
          is_striking_distance?: boolean
          keyword: string
          position: number
          previous_position?: number | null
          run_id: string
          traffic_pct?: number | null
          url?: string | null
          volume?: number | null
        }
        Update: {
          captured_at?: string
          cpc?: number | null
          database?: string
          delta?: number | null
          id?: string
          is_programmatic?: boolean
          is_striking_distance?: boolean
          keyword?: string
          position?: number
          previous_position?: number | null
          run_id?: string
          traffic_pct?: number | null
          url?: string | null
          volume?: number | null
        }
        Relationships: []
      }
      seo_redirects: {
        Row: {
          created_at: string
          created_by: string | null
          hit_count: number
          id: string
          is_active: boolean
          last_hit_at: string | null
          notes: string | null
          source_path: string
          status_code: number
          target_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          hit_count?: number
          id?: string
          is_active?: boolean
          last_hit_at?: string | null
          notes?: string | null
          source_path: string
          status_code?: number
          target_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          hit_count?: number
          id?: string
          is_active?: boolean
          last_hit_at?: string | null
          notes?: string | null
          source_path?: string
          status_code?: number
          target_path?: string
          updated_at?: string
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
            foreignKeyName: "settlements_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
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
      sitemap_health_checks: {
        Row: {
          checked_at: string
          error_message: string | null
          http_status: number | null
          id: string
          is_crawlable: boolean | null
          is_valid_xml: boolean | null
          newest_lastmod: string | null
          oldest_lastmod: string | null
          response_time_ms: number | null
          sitemap_url: string
          url_count: number | null
        }
        Insert: {
          checked_at?: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          is_crawlable?: boolean | null
          is_valid_xml?: boolean | null
          newest_lastmod?: string | null
          oldest_lastmod?: string | null
          response_time_ms?: number | null
          sitemap_url: string
          url_count?: number | null
        }
        Update: {
          checked_at?: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          is_crawlable?: boolean | null
          is_valid_xml?: boolean | null
          newest_lastmod?: string | null
          oldest_lastmod?: string | null
          response_time_ms?: number | null
          sitemap_url?: string
          url_count?: number | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tour_enquiries: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          city: string | null
          created_at: string
          email: string
          enquiry_id: string
          group_type: string
          guest_name: string
          id: string
          package_category: string
          package_difficulty: string
          package_duration: string
          package_location: string
          package_title: string
          per_person_price: number
          preferred_date: string
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          special_requests: string | null
          status: string
          total_amount: number
          travellers: number
          updated_at: string
          user_id: string | null
          whatsapp_number: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          city?: string | null
          created_at?: string
          email: string
          enquiry_id: string
          group_type?: string
          guest_name: string
          id?: string
          package_category: string
          package_difficulty: string
          package_duration: string
          package_location: string
          package_title: string
          per_person_price: number
          preferred_date: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          special_requests?: string | null
          status?: string
          total_amount: number
          travellers?: number
          updated_at?: string
          user_id?: string | null
          whatsapp_number: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          city?: string | null
          created_at?: string
          email?: string
          enquiry_id?: string
          group_type?: string
          guest_name?: string
          id?: string
          package_category?: string
          package_difficulty?: string
          package_duration?: string
          package_location?: string
          package_title?: string
          per_person_price?: number
          preferred_date?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          special_requests?: string | null
          status?: string
          total_amount?: number
          travellers?: number
          updated_at?: string
          user_id?: string | null
          whatsapp_number?: string
        }
        Relationships: []
      }
      tour_pricing: {
        Row: {
          compare_at_price: number | null
          competitor_name: string | null
          competitor_price: number | null
          created_at: string
          duration: string | null
          id: string
          is_active: boolean
          min_group: number | null
          notes: string | null
          price_per_person: number
          region: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          compare_at_price?: number | null
          competitor_name?: string | null
          competitor_price?: number | null
          created_at?: string
          duration?: string | null
          id?: string
          is_active?: boolean
          min_group?: number | null
          notes?: string | null
          price_per_person: number
          region?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          compare_at_price?: number | null
          competitor_name?: string | null
          competitor_price?: number | null
          created_at?: string
          duration?: string | null
          id?: string
          is_active?: boolean
          min_group?: number | null
          notes?: string | null
          price_per_person?: number
          region?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tours: {
        Row: {
          best_season: string | null
          category: string
          created_at: string | null
          currency: string | null
          description: string
          difficulty: string
          duration: string
          exclusions: string[] | null
          exclusive: boolean | null
          faqs: Json | null
          group_size: string | null
          highlights: string[] | null
          id: string
          images: string[] | null
          inclusions: string[] | null
          international: boolean | null
          is_published: boolean | null
          itinerary: Json | null
          location: string
          locations_covered: string[] | null
          original_price: number | null
          price: number
          rating: number | null
          region: string | null
          review_count: number | null
          short_description: string | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string | null
          visa_info: string | null
        }
        Insert: {
          best_season?: string | null
          category?: string
          created_at?: string | null
          currency?: string | null
          description: string
          difficulty?: string
          duration: string
          exclusions?: string[] | null
          exclusive?: boolean | null
          faqs?: Json | null
          group_size?: string | null
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          inclusions?: string[] | null
          international?: boolean | null
          is_published?: boolean | null
          itinerary?: Json | null
          location: string
          locations_covered?: string[] | null
          original_price?: number | null
          price: number
          rating?: number | null
          region?: string | null
          review_count?: number | null
          short_description?: string | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
          visa_info?: string | null
        }
        Update: {
          best_season?: string | null
          category?: string
          created_at?: string | null
          currency?: string | null
          description?: string
          difficulty?: string
          duration?: string
          exclusions?: string[] | null
          exclusive?: boolean | null
          faqs?: Json | null
          group_size?: string | null
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          inclusions?: string[] | null
          international?: boolean | null
          is_published?: boolean | null
          itinerary?: Json | null
          location?: string
          locations_covered?: string[] | null
          original_price?: number | null
          price?: number
          rating?: number | null
          region?: string | null
          review_count?: number | null
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
          visa_info?: string | null
        }
        Relationships: []
      }
      traffic_defense_logs: {
        Row: {
          check_details: Json | null
          check_name: string
          check_passed: boolean
          check_score: number | null
          created_at: string
          id: string
          layer_name: string
          layer_number: number
          session_id: string
          visitor_id: string
        }
        Insert: {
          check_details?: Json | null
          check_name: string
          check_passed: boolean
          check_score?: number | null
          created_at?: string
          id?: string
          layer_name: string
          layer_number: number
          session_id: string
          visitor_id: string
        }
        Update: {
          check_details?: Json | null
          check_name?: string
          check_passed?: boolean
          check_score?: number | null
          created_at?: string
          id?: string
          layer_name?: string
          layer_number?: number
          session_id?: string
          visitor_id?: string
        }
        Relationships: []
      }
      traffic_interaction_events: {
        Row: {
          created_at: string | null
          element_class: string | null
          element_id: string | null
          element_text: string | null
          event_category: string | null
          event_name: string
          event_timestamp: string | null
          event_type: string
          id: string
          is_validated: boolean | null
          metadata: Json | null
          page_url: string | null
          session_id: string
        }
        Insert: {
          created_at?: string | null
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          event_category?: string | null
          event_name: string
          event_timestamp?: string | null
          event_type: string
          id?: string
          is_validated?: boolean | null
          metadata?: Json | null
          page_url?: string | null
          session_id: string
        }
        Update: {
          created_at?: string | null
          element_class?: string | null
          element_id?: string | null
          element_text?: string | null
          event_category?: string | null
          event_name?: string
          event_timestamp?: string | null
          event_type?: string
          id?: string
          is_validated?: boolean | null
          metadata?: Json | null
          page_url?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "traffic_interaction_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "traffic_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      traffic_lead_events: {
        Row: {
          contact_hash: string | null
          contact_type: string | null
          created_at: string | null
          first_touch_source: string | null
          id: string
          last_touch_source: string | null
          lead_source: string | null
          lead_stage: string
          lead_value: number | null
          session_id: string
          visitor_id: string | null
        }
        Insert: {
          contact_hash?: string | null
          contact_type?: string | null
          created_at?: string | null
          first_touch_source?: string | null
          id?: string
          last_touch_source?: string | null
          lead_source?: string | null
          lead_stage: string
          lead_value?: number | null
          session_id: string
          visitor_id?: string | null
        }
        Update: {
          contact_hash?: string | null
          contact_type?: string | null
          created_at?: string | null
          first_touch_source?: string | null
          id?: string
          last_touch_source?: string | null
          lead_source?: string | null
          lead_stage?: string
          lead_value?: number | null
          session_id?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "traffic_lead_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "traffic_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      traffic_page_events: {
        Row: {
          created_at: string | null
          entry_timestamp: string | null
          exit_timestamp: string | null
          id: string
          interaction_count: number | null
          is_entrance: boolean | null
          is_exit: boolean | null
          page_path: string | null
          page_title: string | null
          page_url: string
          referrer: string | null
          scroll_depth: number | null
          session_id: string
          time_spent_seconds: number | null
        }
        Insert: {
          created_at?: string | null
          entry_timestamp?: string | null
          exit_timestamp?: string | null
          id?: string
          interaction_count?: number | null
          is_entrance?: boolean | null
          is_exit?: boolean | null
          page_path?: string | null
          page_title?: string | null
          page_url: string
          referrer?: string | null
          scroll_depth?: number | null
          session_id: string
          time_spent_seconds?: number | null
        }
        Update: {
          created_at?: string | null
          entry_timestamp?: string | null
          exit_timestamp?: string | null
          id?: string
          interaction_count?: number | null
          is_entrance?: boolean | null
          is_exit?: boolean | null
          page_path?: string | null
          page_title?: string | null
          page_url?: string
          referrer?: string | null
          scroll_depth?: number | null
          session_id?: string
          time_spent_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "traffic_page_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "traffic_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      traffic_sessions: {
        Row: {
          active_scroll_seconds: number | null
          bot_likelihood_score: number | null
          browser: string | null
          browser_version: string | null
          call_clicked: boolean | null
          call_validated: boolean | null
          city: string | null
          click_quality_score: number | null
          color_depth: number | null
          connection_type: string | null
          consent_granted_at: string | null
          consent_state: Json | null
          country: string | null
          country_code: string | null
          created_at: string | null
          defense_layer_1_passed: boolean | null
          defense_layer_2_passed: boolean | null
          defense_layer_3_passed: boolean | null
          defense_score: number | null
          device_memory: number | null
          device_model: string | null
          device_type: string | null
          device_vendor: string | null
          duration_seconds: number | null
          ended_at: string | null
          exit_page: string | null
          hardware_concurrency: number | null
          id: string
          intent_category: string | null
          ip_hash: string | null
          is_bot: boolean | null
          is_bounce: boolean | null
          is_return_visitor: boolean | null
          is_validated: boolean | null
          landing_page: string | null
          language: string | null
          languages: Json | null
          last_activity_at: string | null
          latitude: number | null
          longitude: number | null
          max_scroll_depth: number | null
          meets_15s_threshold: boolean | null
          operating_system: string | null
          os_version: string | null
          page_views: number | null
          pixel_ratio: number | null
          platform: string | null
          referrer_medium: string | null
          referrer_source: string | null
          referrer_url: string | null
          screen_height: number | null
          screen_width: number | null
          sent_to_ga4: boolean | null
          sent_to_ga4_at: string | null
          session_classification: string | null
          session_id: string
          state: string | null
          timezone: string | null
          timezone_offset: number | null
          total_interactions: number | null
          touch_points: number | null
          traffic_quality: string | null
          unified_intent_score: number | null
          user_device_tier: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visit_count: number | null
          visitor_id: string
          whatsapp_clicked: boolean | null
          whatsapp_validated: boolean | null
        }
        Insert: {
          active_scroll_seconds?: number | null
          bot_likelihood_score?: number | null
          browser?: string | null
          browser_version?: string | null
          call_clicked?: boolean | null
          call_validated?: boolean | null
          city?: string | null
          click_quality_score?: number | null
          color_depth?: number | null
          connection_type?: string | null
          consent_granted_at?: string | null
          consent_state?: Json | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          defense_layer_1_passed?: boolean | null
          defense_layer_2_passed?: boolean | null
          defense_layer_3_passed?: boolean | null
          defense_score?: number | null
          device_memory?: number | null
          device_model?: string | null
          device_type?: string | null
          device_vendor?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          exit_page?: string | null
          hardware_concurrency?: number | null
          id?: string
          intent_category?: string | null
          ip_hash?: string | null
          is_bot?: boolean | null
          is_bounce?: boolean | null
          is_return_visitor?: boolean | null
          is_validated?: boolean | null
          landing_page?: string | null
          language?: string | null
          languages?: Json | null
          last_activity_at?: string | null
          latitude?: number | null
          longitude?: number | null
          max_scroll_depth?: number | null
          meets_15s_threshold?: boolean | null
          operating_system?: string | null
          os_version?: string | null
          page_views?: number | null
          pixel_ratio?: number | null
          platform?: string | null
          referrer_medium?: string | null
          referrer_source?: string | null
          referrer_url?: string | null
          screen_height?: number | null
          screen_width?: number | null
          sent_to_ga4?: boolean | null
          sent_to_ga4_at?: string | null
          session_classification?: string | null
          session_id: string
          state?: string | null
          timezone?: string | null
          timezone_offset?: number | null
          total_interactions?: number | null
          touch_points?: number | null
          traffic_quality?: string | null
          unified_intent_score?: number | null
          user_device_tier?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visit_count?: number | null
          visitor_id: string
          whatsapp_clicked?: boolean | null
          whatsapp_validated?: boolean | null
        }
        Update: {
          active_scroll_seconds?: number | null
          bot_likelihood_score?: number | null
          browser?: string | null
          browser_version?: string | null
          call_clicked?: boolean | null
          call_validated?: boolean | null
          city?: string | null
          click_quality_score?: number | null
          color_depth?: number | null
          connection_type?: string | null
          consent_granted_at?: string | null
          consent_state?: Json | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          defense_layer_1_passed?: boolean | null
          defense_layer_2_passed?: boolean | null
          defense_layer_3_passed?: boolean | null
          defense_score?: number | null
          device_memory?: number | null
          device_model?: string | null
          device_type?: string | null
          device_vendor?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          exit_page?: string | null
          hardware_concurrency?: number | null
          id?: string
          intent_category?: string | null
          ip_hash?: string | null
          is_bot?: boolean | null
          is_bounce?: boolean | null
          is_return_visitor?: boolean | null
          is_validated?: boolean | null
          landing_page?: string | null
          language?: string | null
          languages?: Json | null
          last_activity_at?: string | null
          latitude?: number | null
          longitude?: number | null
          max_scroll_depth?: number | null
          meets_15s_threshold?: boolean | null
          operating_system?: string | null
          os_version?: string | null
          page_views?: number | null
          pixel_ratio?: number | null
          platform?: string | null
          referrer_medium?: string | null
          referrer_source?: string | null
          referrer_url?: string | null
          screen_height?: number | null
          screen_width?: number | null
          sent_to_ga4?: boolean | null
          sent_to_ga4_at?: string | null
          session_classification?: string | null
          session_id?: string
          state?: string | null
          timezone?: string | null
          timezone_offset?: number | null
          total_interactions?: number | null
          touch_points?: number | null
          traffic_quality?: string | null
          unified_intent_score?: number | null
          user_device_tier?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visit_count?: number | null
          visitor_id?: string
          whatsapp_clicked?: boolean | null
          whatsapp_validated?: boolean | null
        }
        Relationships: []
      }
      traffic_validated_events: {
        Row: {
          adjusted_conversion_value: number | null
          click_quality_score: number | null
          conversion_value: number | null
          created_at: string | null
          currency: string | null
          event_category: string | null
          event_name: string
          id: string
          intent_category: string | null
          sent_to_ads: boolean | null
          sent_to_ads_at: string | null
          sent_to_ga4: boolean | null
          sent_to_ga4_at: string | null
          session_id: string
          unified_intent_score: number | null
          user_device_tier: string | null
          validation_passed: boolean
          validation_reason: string | null
          validation_rules_met: Json | null
          value_multiplier: number | null
        }
        Insert: {
          adjusted_conversion_value?: number | null
          click_quality_score?: number | null
          conversion_value?: number | null
          created_at?: string | null
          currency?: string | null
          event_category?: string | null
          event_name: string
          id?: string
          intent_category?: string | null
          sent_to_ads?: boolean | null
          sent_to_ads_at?: string | null
          sent_to_ga4?: boolean | null
          sent_to_ga4_at?: string | null
          session_id: string
          unified_intent_score?: number | null
          user_device_tier?: string | null
          validation_passed?: boolean
          validation_reason?: string | null
          validation_rules_met?: Json | null
          value_multiplier?: number | null
        }
        Update: {
          adjusted_conversion_value?: number | null
          click_quality_score?: number | null
          conversion_value?: number | null
          created_at?: string | null
          currency?: string | null
          event_category?: string | null
          event_name?: string
          id?: string
          intent_category?: string | null
          sent_to_ads?: boolean | null
          sent_to_ads_at?: string | null
          sent_to_ga4?: boolean | null
          sent_to_ga4_at?: string | null
          session_id?: string
          unified_intent_score?: number | null
          user_device_tier?: string | null
          validation_passed?: boolean
          validation_reason?: string | null
          validation_rules_met?: Json | null
          value_multiplier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "traffic_validated_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "traffic_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      traffic_visitor_history: {
        Row: {
          avg_intent_score: number | null
          avg_session_duration: number | null
          city: string | null
          conversion_count: number | null
          converted: boolean | null
          country_code: string | null
          created_at: string
          cumulative_defense_score: number | null
          first_seen_at: string
          highest_intent_score: number | null
          id: string
          is_hot_lead: boolean | null
          is_known_bot: boolean | null
          is_known_junk: boolean | null
          last_seen_at: string
          preferred_device: string | null
          preferred_os: string | null
          total_conversion_value: number | null
          total_page_views: number | null
          total_sessions: number | null
          updated_at: string
          visitor_id: string
        }
        Insert: {
          avg_intent_score?: number | null
          avg_session_duration?: number | null
          city?: string | null
          conversion_count?: number | null
          converted?: boolean | null
          country_code?: string | null
          created_at?: string
          cumulative_defense_score?: number | null
          first_seen_at?: string
          highest_intent_score?: number | null
          id?: string
          is_hot_lead?: boolean | null
          is_known_bot?: boolean | null
          is_known_junk?: boolean | null
          last_seen_at?: string
          preferred_device?: string | null
          preferred_os?: string | null
          total_conversion_value?: number | null
          total_page_views?: number | null
          total_sessions?: number | null
          updated_at?: string
          visitor_id: string
        }
        Update: {
          avg_intent_score?: number | null
          avg_session_duration?: number | null
          city?: string | null
          conversion_count?: number | null
          converted?: boolean | null
          country_code?: string | null
          created_at?: string
          cumulative_defense_score?: number | null
          first_seen_at?: string
          highest_intent_score?: number | null
          id?: string
          is_hot_lead?: boolean | null
          is_known_bot?: boolean | null
          is_known_junk?: boolean | null
          last_seen_at?: string
          preferred_device?: string | null
          preferred_os?: string | null
          total_conversion_value?: number | null
          total_page_views?: number | null
          total_sessions?: number | null
          updated_at?: string
          visitor_id?: string
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
          attribution_campaign: string | null
          attribution_medium: string | null
          attribution_source: string | null
          avg_booking_value: number | null
          avg_session_duration: number | null
          booking_intent_score: number | null
          consent_analytics: boolean | null
          consent_marketing: boolean | null
          consent_personalization: boolean | null
          created_at: string | null
          device_fingerprint: string | null
          first_booking_at: string | null
          first_seen_at: string | null
          first_touch_campaign: string | null
          first_touch_medium: string | null
          first_touch_source: string | null
          funnel_stage: string | null
          id: string
          inactivity_expires_at: string | null
          is_android: boolean | null
          is_group_organizer: boolean | null
          is_high_intent: boolean | null
          is_ios: boolean | null
          is_repeat_traveller: boolean | null
          is_solo_traveller: boolean | null
          last_booking_at: string | null
          last_page_viewed: string | null
          last_seen_at: string | null
          last_touch_medium: string | null
          last_touch_source: string | null
          lifetime_value: number | null
          predicted_intent: string | null
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
          attribution_campaign?: string | null
          attribution_medium?: string | null
          attribution_source?: string | null
          avg_booking_value?: number | null
          avg_session_duration?: number | null
          booking_intent_score?: number | null
          consent_analytics?: boolean | null
          consent_marketing?: boolean | null
          consent_personalization?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          first_booking_at?: string | null
          first_seen_at?: string | null
          first_touch_campaign?: string | null
          first_touch_medium?: string | null
          first_touch_source?: string | null
          funnel_stage?: string | null
          id?: string
          inactivity_expires_at?: string | null
          is_android?: boolean | null
          is_group_organizer?: boolean | null
          is_high_intent?: boolean | null
          is_ios?: boolean | null
          is_repeat_traveller?: boolean | null
          is_solo_traveller?: boolean | null
          last_booking_at?: string | null
          last_page_viewed?: string | null
          last_seen_at?: string | null
          last_touch_medium?: string | null
          last_touch_source?: string | null
          lifetime_value?: number | null
          predicted_intent?: string | null
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
          attribution_campaign?: string | null
          attribution_medium?: string | null
          attribution_source?: string | null
          avg_booking_value?: number | null
          avg_session_duration?: number | null
          booking_intent_score?: number | null
          consent_analytics?: boolean | null
          consent_marketing?: boolean | null
          consent_personalization?: boolean | null
          created_at?: string | null
          device_fingerprint?: string | null
          first_booking_at?: string | null
          first_seen_at?: string | null
          first_touch_campaign?: string | null
          first_touch_medium?: string | null
          first_touch_source?: string | null
          funnel_stage?: string | null
          id?: string
          inactivity_expires_at?: string | null
          is_android?: boolean | null
          is_group_organizer?: boolean | null
          is_high_intent?: boolean | null
          is_ios?: boolean | null
          is_repeat_traveller?: boolean | null
          is_solo_traveller?: boolean | null
          last_booking_at?: string | null
          last_page_viewed?: string | null
          last_seen_at?: string | null
          last_touch_medium?: string | null
          last_touch_source?: string | null
          lifetime_value?: number | null
          predicted_intent?: string | null
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
          payload: Json
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
      whatsapp_templates: {
        Row: {
          created_at: string
          cta_button_text: string | null
          cta_button_url: string | null
          id: string
          is_active: boolean | null
          message_body: string
          template_key: string
          template_name: string
          updated_at: string
          variables_hint: string | null
        }
        Insert: {
          created_at?: string
          cta_button_text?: string | null
          cta_button_url?: string | null
          id?: string
          is_active?: boolean | null
          message_body: string
          template_key: string
          template_name: string
          updated_at?: string
          variables_hint?: string | null
        }
        Update: {
          created_at?: string
          cta_button_text?: string | null
          cta_button_url?: string | null
          id?: string
          is_active?: boolean | null
          message_body?: string
          template_key?: string
          template_name?: string
          updated_at?: string
          variables_hint?: string | null
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
      public_properties: {
        Row: {
          city: string | null
          created_at: string | null
          currency: string | null
          id: string | null
          is_active: boolean | null
          logo_url: string | null
          name: string | null
          slug: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          name?: string | null
          slug?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          name?: string | null
          slug?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews_public: {
        Row: {
          created_at: string | null
          guest_name: string | null
          id: string | null
          photos: string[] | null
          property_id: string | null
          rating: number | null
          review_text: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          guest_name?: string | null
          id?: string | null
          photos?: string[] | null
          property_id?: string | null
          rating?: number | null
          review_text?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          guest_name?: string | null
          id?: string | null
          photos?: string[] | null
          property_id?: string | null
          rating?: number | null
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
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
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
      approve_enquiry: {
        Args: { p_admin_id: string; p_enquiry_uuid: string }
        Returns: {
          booking_id: string
          invoice_number: string
        }[]
      }
      calculate_onboarding_readiness: {
        Args: { checklist: Json }
        Returns: number
      }
      calculate_readiness_score: {
        Args: { p_property_id: string }
        Returns: number
      }
      calculate_spend_tier: { Args: { p_visitor_id: string }; Returns: string }
      categorize_intent: { Args: { score: number }; Returns: string }
      categorize_traffic_quality: {
        Args: {
          bot_likelihood: number
          intent_score: number
          is_bounce: boolean
        }
        Returns: string
      }
      check_idempotency: {
        Args: {
          p_key: string
          p_operation_type: string
          p_request_hash?: string
        }
        Returns: Json
      }
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
      classify_traffic_session: {
        Args: {
          p_active_scroll_seconds: number
          p_bot_likelihood: number
          p_defense_score: number
          p_intent_score: number
        }
        Returns: string
      }
      classify_traveller_segment: {
        Args: { p_visitor_id: string }
        Returns: string
      }
      cleanup_expired_cache: { Args: never; Returns: number }
      cleanup_expired_otp: { Args: never; Returns: undefined }
      cleanup_expired_rate_limits: { Args: never; Returns: undefined }
      cleanup_old_traffic_data: { Args: never; Returns: Json }
      cleanup_rate_limits: { Args: never; Returns: undefined }
      cleanup_stale_realtime_visitors: { Args: never; Returns: number }
      compute_intent_score: {
        Args: {
          p_bot_likelihood: number
          p_device_tier: string
          p_duration_seconds: number
          p_interaction_count: number
          p_page_views: number
          p_scroll_depth: number
        }
        Returns: number
      }
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
          p_message_to_host?: string
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
          p_user_id?: string
        }
        Returns: Json
      }
      create_enquiry: {
        Args: {
          p_address?: string
          p_check_in: string
          p_check_out: string
          p_city?: string
          p_email: string
          p_gst_amount: number
          p_gst_rate: number
          p_guest_name: string
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
          p_user_id?: string
        }
        Returns: {
          enquiry_id: string
          enquiry_uuid: string
        }[]
      }
      current_user_id: { Args: never; Returns: string }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      delete_my_data: { Args: never; Returns: boolean }
      deny_booking_with_message: {
        Args: { p_admin_id: string; p_booking_id: string; p_reason?: string }
        Returns: Json
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      expire_inactive_visitors: { Args: never; Returns: undefined }
      export_my_data: { Args: never; Returns: Json }
      generate_booking_id: { Args: never; Returns: string }
      generate_invoice_number: { Args: never; Returns: string }
      generate_password_reset_otp: { Args: { p_email: string }; Returns: Json }
      get_analytics_overview: { Args: { days_back?: number }; Returns: Json }
      get_app_secret: { Args: { secret_name: string }; Returns: string }
      get_app_secret_secure: { Args: { secret_name: string }; Returns: string }
      get_booking_calendar: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: {
          approved_at: string
          booking_id: string
          booking_status: string
          check_in: string
          check_out: string
          email: string
          guest_name: string
          id: string
          no_show_marked_at: string
          quantity: number
          room_type: string
          total_amount: number
        }[]
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
      get_masked_booking_data: {
        Args: { booking_id_param?: string; user_email: string }
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
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      record_settlement_transition: {
        Args: {
          p_actor_id?: string
          p_amount?: number
          p_booking_id: string
          p_booking_reference: string
          p_new_status: string
          p_notes?: string
        }
        Returns: string
      }
      resolve_room_type_id: { Args: { p_room_type: string }; Returns: string }
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
      verify_booking_access:
        | {
            Args: { booking_email: string; booking_id_param?: string }
            Returns: boolean
          }
        | { Args: { p_booking_id: string }; Returns: boolean }
      verify_booking_owner_only: {
        Args: { booking_email: string }
        Returns: boolean
      }
      verify_password_reset_otp: {
        Args: { p_email: string; p_otp: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user" | "guest" | "franchise"
      booking_settlement_status:
        | "initiated"
        | "confirmed"
        | "stayed"
        | "cancelled"
        | "no_show"
        | "refund_pending"
        | "refunded"
        | "settled"
      user_role:
        | "guest"
        | "staff"
        | "admin"
        | "channel_manager"
        | "housekeeping"
        | "front_desk"
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
      booking_settlement_status: [
        "initiated",
        "confirmed",
        "stayed",
        "cancelled",
        "no_show",
        "refund_pending",
        "refunded",
        "settled",
      ],
      user_role: [
        "guest",
        "staff",
        "admin",
        "channel_manager",
        "housekeeping",
        "front_desk",
      ],
    },
  },
} as const
