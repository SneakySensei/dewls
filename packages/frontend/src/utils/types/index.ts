import { type Database } from "./database.types";

export type MappedConnectedWallet =
  Database["public"]["Tables"]["connected_wallets"]["Row"];
export type MappedGameTier = Database["public"]["Tables"]["game_tiers"]["Row"];
export type MappedGame = Database["public"]["Tables"]["games"]["Row"];
export type MappedPlayedGame =
  Database["public"]["Tables"]["played_games"]["Row"];
export type MappedSeason = Database["public"]["Tables"]["seasons"]["Row"];
export type MappedUser = Database["public"]["Tables"]["users"]["Row"];
