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
      connected_wallets: {
        Row: {
          chain_id: number
          connected_wallet_id: string
          created_at: string
          is_primary: boolean
          nickname: string | null
          user_id: string
          wallet_address: string
        }
        Insert: {
          chain_id: number
          connected_wallet_id: string
          created_at?: string
          is_primary?: boolean
          nickname?: string | null
          user_id: string
          wallet_address: string
        }
        Update: {
          chain_id?: number
          connected_wallet_id?: string
          created_at?: string
          is_primary?: boolean
          nickname?: string | null
          user_id?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "connected_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      game_tiers: {
        Row: {
          created_at: string
          name: string
          point_weight: number
          tier_id: string
          usd_amount: number
        }
        Insert: {
          created_at?: string
          name: string
          point_weight: number
          tier_id?: string
          usd_amount: number
        }
        Update: {
          created_at?: string
          name?: string
          point_weight?: number
          tier_id?: string
          usd_amount?: number
        }
        Relationships: []
      }
      games: {
        Row: {
          cover_image: string
          created_at: string
          description: string
          game_id: string
          icon_image: string
          name: string
        }
        Insert: {
          cover_image: string
          created_at?: string
          description: string
          game_id?: string
          icon_image: string
          name: string
        }
        Update: {
          cover_image?: string
          created_at?: string
          description?: string
          game_id?: string
          icon_image?: string
          name?: string
        }
        Relationships: []
      }
      played_games: {
        Row: {
          chain_id: number
          created_at: string
          game_id: string
          game_tier_id: string
          is_active: boolean
          played_game_id: number
          player_1_id: string
          player_2_id: string
          season_id: string
          winner_id: string | null
        }
        Insert: {
          chain_id: number
          created_at?: string
          game_id?: string
          game_tier_id?: string
          is_active?: boolean
          played_game_id?: number
          player_1_id?: string
          player_2_id?: string
          season_id: string
          winner_id?: string | null
        }
        Update: {
          chain_id?: number
          created_at?: string
          game_id?: string
          game_tier_id?: string
          is_active?: boolean
          played_game_id?: number
          player_1_id?: string
          player_2_id?: string
          season_id?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "played_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "played_games_game_tier_id_fkey"
            columns: ["game_tier_id"]
            isOneToOne: false
            referencedRelation: "game_tiers"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "played_games_player_1_id_fkey"
            columns: ["player_1_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "played_games_player_2_id_fkey"
            columns: ["player_2_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "played_games_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "played_games_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string
          ended_on: string
          reward_pool_usd: number
          season_id: string
          started_on: string
        }
        Insert: {
          created_at?: string
          ended_on: string
          reward_pool_usd?: number
          season_id?: string
          started_on: string
        }
        Update: {
          created_at?: string
          ended_on?: string
          reward_pool_usd?: number
          season_id?: string
          started_on?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email_id: string
          name: string
          profile_photo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_id: string
          name: string
          profile_photo: string
          user_id?: string
        }
        Update: {
          created_at?: string
          email_id?: string
          name?: string
          profile_photo?: string
          user_id?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
