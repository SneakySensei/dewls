import { type Database } from "./database.types";

export type MappedGameTier = Database["public"]["Tables"]["game_tiers"]["Row"];
export type MappedGame = Database["public"]["Tables"]["games"]["Row"];
export type MappedPlayedGame =
    Database["public"]["Tables"]["played_games"]["Row"];
export type MappedSeason = Database["public"]["Tables"]["seasons"]["Row"];
export type MappedPlayer = Database["public"]["Tables"]["players"]["Row"];

export type MappedLeaderboard =
    Database["public"]["Views"]["leaderboard"]["Row"];
export type MappedPlayerGameHistory =
    Database["public"]["Views"]["player_game_history"]["Row"];
