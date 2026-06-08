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
      blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_applications: {
        Row: {
          campaign_id: string
          created_at: string
          creator_id: string
          id: string
          pitch: string
          status: Database["public"]["Enums"]["application_status"]
        }
        Insert: {
          campaign_id: string
          created_at?: string
          creator_id: string
          id?: string
          pitch?: string
          status?: Database["public"]["Enums"]["application_status"]
        }
        Update: {
          campaign_id?: string
          created_at?: string
          creator_id?: string
          id?: string
          pitch?: string
          status?: Database["public"]["Enums"]["application_status"]
        }
        Relationships: [
          {
            foreignKeyName: "campaign_applications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_applications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          application_count: number
          brand_id: string
          budget: number
          category: Database["public"]["Enums"]["campaign_category"]
          created_at: string
          deadline: string | null
          description: string
          id: string
          status: Database["public"]["Enums"]["campaign_status"]
          title: string
        }
        Insert: {
          application_count?: number
          brand_id: string
          budget?: number
          category?: Database["public"]["Enums"]["campaign_category"]
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          status?: Database["public"]["Enums"]["campaign_status"]
          title: string
        }
        Update: {
          application_count?: number
          brand_id?: string
          budget?: number
          category?: Database["public"]["Enums"]["campaign_category"]
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          status?: Database["public"]["Enums"]["campaign_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_purchases: {
        Row: {
          amount_cents: number
          coins: number
          created_at: string
          id: string
          status: string
          stripe_session_id: string
          user_id: string
        }
        Insert: {
          amount_cents?: number
          coins: number
          created_at?: string
          id?: string
          status?: string
          stripe_session_id: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          coins?: number
          created_at?: string
          id?: string
          status?: string
          stripe_session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string
          id: string
          type: Database["public"]["Enums"]["coin_txn_type"]
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string
          id?: string
          type: Database["public"]["Enums"]["coin_txn_type"]
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string
          id?: string
          type?: Database["public"]["Enums"]["coin_txn_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          created_at: string
          id: string
          like_count: number
          text: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          like_count?: number
          text: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          like_count?: number
          text?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          creator_id: string
          current_period_end: string | null
          environment: string
          id: string
          monthly_coins: number
          price_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          subscriber_id: string
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          creator_id: string
          current_period_end?: string | null
          environment?: string
          id?: string
          monthly_coins?: number
          price_id: string
          status?: string
          stripe_customer_id: string
          stripe_subscription_id: string
          subscriber_id: string
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          creator_id?: string
          current_period_end?: string | null
          environment?: string
          id?: string
          monthly_coins?: number
          price_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          subscriber_id?: string
          updated_at?: string
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
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gifts: {
        Row: {
          coin_amount: number
          created_at: string
          gift_type: Database["public"]["Enums"]["gift_type"]
          id: string
          receiver_id: string
          sender_id: string
          stream_id: string | null
          video_id: string | null
        }
        Insert: {
          coin_amount: number
          created_at?: string
          gift_type: Database["public"]["Enums"]["gift_type"]
          id?: string
          receiver_id: string
          sender_id: string
          stream_id?: string | null
          video_id?: string | null
        }
        Update: {
          coin_amount?: number
          created_at?: string
          gift_type?: Database["public"]["Enums"]["gift_type"]
          id?: string
          receiver_id?: string
          sender_id?: string
          stream_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gifts_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gifts_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gifts_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_agreements: {
        Row: {
          accepted_at: string
          document: string
          id: string
          ip_address: string | null
          user_id: string
          version: string
        }
        Insert: {
          accepted_at?: string
          document: string
          id?: string
          ip_address?: string | null
          user_id: string
          version?: string
        }
        Update: {
          accepted_at?: string
          document?: string
          id?: string
          ip_address?: string | null
          user_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "legal_agreements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      live_messages: {
        Row: {
          created_at: string
          id: string
          stream_id: string
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stream_id: string
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stream_id?: string
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_messages_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "live_streams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_streams: {
        Row: {
          created_at: string
          creator_id: string
          ended_at: string | null
          id: string
          status: Database["public"]["Enums"]["stream_status"]
          title: string
          total_gifts: number
          viewer_count: number
        }
        Insert: {
          created_at?: string
          creator_id: string
          ended_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["stream_status"]
          title?: string
          total_gifts?: number
          viewer_count?: number
        }
        Update: {
          created_at?: string
          creator_id?: string
          ended_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["stream_status"]
          title?: string
          total_gifts?: number
          viewer_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "live_streams_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_requests: {
        Row: {
          amount_cents: number
          coins: number
          created_at: string
          id: string
          processed_at: string | null
          status: string
          stripe_transfer_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          coins: number
          created_at?: string
          id?: string
          processed_at?: string | null
          status?: string
          stripe_transfer_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          coins?: number
          created_at?: string
          id?: string
          processed_at?: string | null
          status?: string
          stripe_transfer_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_verified: boolean
          avatar_url: string | null
          bio: string
          coin_balance: number
          created_at: string
          display_name: string
          id: string
          payouts_enabled: boolean
          stripe_connect_account_id: string | null
          total_earned: number
          total_spent: number
          username: string
        }
        Insert: {
          age_verified?: boolean
          avatar_url?: string | null
          bio?: string
          coin_balance?: number
          created_at?: string
          display_name?: string
          id: string
          payouts_enabled?: boolean
          stripe_connect_account_id?: string | null
          total_earned?: number
          total_spent?: number
          username: string
        }
        Update: {
          age_verified?: boolean
          avatar_url?: string | null
          bio?: string
          coin_balance?: number
          created_at?: string
          display_name?: string
          id?: string
          payouts_enabled?: boolean
          stripe_connect_account_id?: string | null
          total_earned?: number
          total_spent?: number
          username?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          reason: string
          reporter_id: string
          status: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          reason: string
          reporter_id: string
          status?: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          reason?: string
          reporter_id?: string
          status?: Database["public"]["Enums"]["report_status"]
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_payments: {
        Row: {
          amount_cents: number
          coins: number
          created_at: string
          creator_id: string
          id: string
          stripe_invoice_id: string
          subscriber_id: string
        }
        Insert: {
          amount_cents?: number
          coins: number
          created_at?: string
          creator_id: string
          id?: string
          stripe_invoice_id: string
          subscriber_id: string
        }
        Update: {
          amount_cents?: number
          coins?: number
          created_at?: string
          creator_id?: string
          id?: string
          stripe_invoice_id?: string
          subscriber_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          creator_id: string
          id: string
          monthly_coins: number
          status: Database["public"]["Enums"]["sub_status"]
          subscriber_id: string
          tier: Database["public"]["Enums"]["sub_tier"]
        }
        Insert: {
          created_at?: string
          creator_id: string
          id?: string
          monthly_coins?: number
          status?: Database["public"]["Enums"]["sub_status"]
          subscriber_id: string
          tier?: Database["public"]["Enums"]["sub_tier"]
        }
        Update: {
          created_at?: string
          creator_id?: string
          id?: string
          monthly_coins?: number
          status?: Database["public"]["Enums"]["sub_status"]
          subscriber_id?: string
          tier?: Database["public"]["Enums"]["sub_tier"]
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          caption: string
          comment_count: number
          cover_url: string | null
          created_at: string
          creator_id: string
          duration: number
          id: string
          is_affiliate: boolean
          like_count: number
          media_url: string | null
          mux_asset_id: string | null
          mux_asset_status: string | null
          mux_playback_id: string | null
          mux_upload_id: string | null
          product_clicks: number
          product_cta: string | null
          product_description: string | null
          product_title: string | null
          product_url: string | null
          status: Database["public"]["Enums"]["video_status"]
          tags: string[]
          title: string
          view_count: number
        }
        Insert: {
          caption?: string
          comment_count?: number
          cover_url?: string | null
          created_at?: string
          creator_id: string
          duration?: number
          id?: string
          is_affiliate?: boolean
          like_count?: number
          media_url?: string | null
          mux_asset_id?: string | null
          mux_asset_status?: string | null
          mux_playback_id?: string | null
          mux_upload_id?: string | null
          product_clicks?: number
          product_cta?: string | null
          product_description?: string | null
          product_title?: string | null
          product_url?: string | null
          status?: Database["public"]["Enums"]["video_status"]
          tags?: string[]
          title?: string
          view_count?: number
        }
        Update: {
          caption?: string
          comment_count?: number
          cover_url?: string | null
          created_at?: string
          creator_id?: string
          duration?: number
          id?: string
          is_affiliate?: boolean
          like_count?: number
          media_url?: string | null
          mux_asset_id?: string | null
          mux_asset_status?: string | null
          mux_playback_id?: string | null
          mux_upload_id?: string | null
          product_clicks?: number
          product_cta?: string | null
          product_description?: string | null
          product_title?: string | null
          product_url?: string | null
          status?: Database["public"]["Enums"]["video_status"]
          tags?: string[]
          title?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "videos_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      credit_coin_purchase: {
        Args: {
          _amount_cents: number
          _coins: number
          _session_id: string
          _user_id: string
        }
        Returns: Json
      }
      credit_subscription_invoice: {
        Args: {
          _amount_cents: number
          _coins: number
          _creator_id: string
          _invoice_id: string
          _subscriber_id: string
        }
        Returns: Json
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
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
      refund_payout: { Args: { _request_id: string }; Returns: undefined }
      request_payout: { Args: { _coins: number }; Returns: Json }
      send_gift: {
        Args: {
          _coin_amount: number
          _gift_type: Database["public"]["Enums"]["gift_type"]
          _receiver_id: string
          _stream_id?: string
          _video_id?: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "user" | "admin"
      application_status: "pending" | "accepted" | "rejected"
      campaign_category:
        | "fashion"
        | "beauty"
        | "tech"
        | "food"
        | "fitness"
        | "gaming"
        | "lifestyle"
        | "music"
        | "travel"
        | "education"
      campaign_status: "active" | "paused" | "completed" | "cancelled"
      coin_txn_type:
        | "purchase"
        | "gift_sent"
        | "gift_received"
        | "welcome"
        | "withdrawal"
      gift_type:
        | "fire"
        | "rocket"
        | "diamond"
        | "crown"
        | "heartburst"
        | "lightning"
      report_status: "pending" | "reviewed" | "resolved" | "dismissed"
      stream_status: "live" | "ended"
      sub_status: "active" | "cancelled"
      sub_tier: "fan" | "supporter" | "vip"
      video_status: "published" | "removed" | "processing" | "errored"
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
      app_role: ["user", "admin"],
      application_status: ["pending", "accepted", "rejected"],
      campaign_category: [
        "fashion",
        "beauty",
        "tech",
        "food",
        "fitness",
        "gaming",
        "lifestyle",
        "music",
        "travel",
        "education",
      ],
      campaign_status: ["active", "paused", "completed", "cancelled"],
      coin_txn_type: [
        "purchase",
        "gift_sent",
        "gift_received",
        "welcome",
        "withdrawal",
      ],
      gift_type: [
        "fire",
        "rocket",
        "diamond",
        "crown",
        "heartburst",
        "lightning",
      ],
      report_status: ["pending", "reviewed", "resolved", "dismissed"],
      stream_status: ["live", "ended"],
      sub_status: ["active", "cancelled"],
      sub_tier: ["fan", "supporter", "vip"],
      video_status: ["published", "removed", "processing", "errored"],
    },
  },
} as const
