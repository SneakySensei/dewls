import { RockPaperScissors } from "./rock-paper-scissors";

export enum GAME_NAMESPACES {
  // TIC_TAC_TOE = "tic-tac-toe",
  ROCK_PAPER_SCISSORS = "rock-paper-scissors",
}

export enum TIERS {
  ALPHA = "0e8cb282-7bab-4631-8b3a-76795e3cb92f",
  BETA = "397bf400-1d70-4edb-927f-ea6306ea6240",
  GAAMA = "5f534987-4ca5-4b27-8597-835fc9512f85",
}

export const GAMES = {
  [GAME_NAMESPACES.ROCK_PAPER_SCISSORS]: RockPaperScissors,
};
