"use client";

import { ComponentProps, useState } from "react";
import MainMenu from "./components/MainMenu";
import Game from "./components/Game";
import { TIERS_IDS } from "common";

export default function TicTacToe() {
  const [screen, setScreen] = useState<"main-menu" | "game">("main-menu");
  const [tier, setTier] = useState<TIERS_IDS>(TIERS_IDS.ALPHA);
  const handleJoin: ComponentProps<typeof MainMenu>["onJoin"] = (tier) => {
    setScreen("game");
    setTier(tier);
  };

  switch (screen) {
    case "main-menu":
      return <MainMenu onJoin={handleJoin} />;
    case "game":
      return <Game tier={tier} />;
  }
}
