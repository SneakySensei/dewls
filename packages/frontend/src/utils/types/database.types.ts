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
          max_occupancy: number
          name: string
          slug: string
        }
        Insert: {
          cover_image: string
          created_at?: string
          description: string
          game_id?: string
          icon_image: string
          max_occupancy?: number
          name: string
          slug: string
        }
        Update: {
          cover_image?: string
          created_at?: string
          description?: string
          game_id?: string
          icon_image?: string
          max_occupancy?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      played_games: {
        Row: {
          attestation_hash: string | null
          created_at: string
          game_id: string
          game_tier_id: string
          is_active: boolean
          played_game_id: string
          player_1_id: string | null
          player_2_id: string | null
          season_id: string
          winner_id: string | null
        }
        Insert: {
          attestation_hash?: string | null
          created_at?: string
          game_id?: string
          game_tier_id?: string
          is_active?: boolean
          played_game_id?: string
          player_1_id?: string | null
          player_2_id?: string | null
          season_id: string
          winner_id?: string | null
        }
        Update: {
          attestation_hash?: string | null
          created_at?: string
          game_id?: string
          game_tier_id?: string
          is_active?: boolean
          played_game_id?: string
          player_1_id?: string | null
          player_2_id?: string | null
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
            referencedRelation: "leaderboard"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "played_games_player_1_id_fkey"
            columns: ["player_1_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "played_games_player_2_id_fkey"
            columns: ["player_2_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "played_games_player_2_id_fkey"
            columns: ["player_2_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["player_id"]
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
            referencedRelation: "leaderboard"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "played_games_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["player_id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          email_id: string
          name: string
          player_id: string
          profile_photo: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          email_id: string
          name: string
          player_id?: string
          profile_photo: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          email_id?: string
          name?: string
          player_id?: string
          profile_photo?: string
          wallet_address?: string
        }
        Relationships: []
      }
      seasons: {
        Row: {
          created_at: string
          ended_on: string
          name: string
          reward_pool_usd: number
          season_id: string
          started_on: string
        }
        Insert: {
          created_at?: string
          ended_on: string
          name?: string
          reward_pool_usd?: number
          season_id?: string
          started_on: string
        }
        Update: {
          created_at?: string
          ended_on?: string
          name?: string
          reward_pool_usd?: number
          season_id?: string
          started_on?: string
        }
        Relationships: []
      }
    }
    Views: {
      game_history: {
        Row: {
          created_at: string | null
          game_id: string | null
          game_tier_id: string | null
          played_game_id: string | null
          player_1: Json | null
          player_2: Json | null
          season_id: string | null
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
            foreignKeyName: "played_games_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["season_id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          games_played: number | null
          games_won: number | null
          name: string | null
          player_id: string | null
          profile_photo: string | null
          season_id: string | null
          total_points: number | null
          wallet_address: string | null
        }
        Relationships: [
          {
            foreignKeyName: "played_games_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["season_id"]
          },
        ]
      }
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
