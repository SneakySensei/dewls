import { RockPaperScissors } from "./rock-paper-scissors";

export enum GAME_NAMESPACES {
  // TIC_TAC_TOE = "tic-tac-toe",
  ROCK_PAPER_SCISSORS = "rock-paper-scissors",
}

export enum TIERS {
  ALPHA = "ALPHA",
  BETA = "BETA",
  GAAMA = "GAAMA",
}

export const GAMES = {
  [GAME_NAMESPACES.ROCK_PAPER_SCISSORS]: RockPaperScissors,
};
