"use client";

import { ComponentProps, useState } from "react";
import MainMenu from "./components/MainMenu";
import Game from "./components/Game";
import { TIERS_IDS } from "common";

export default function TicTacToe() {
  const [screen, setScreen] = useState<"main-menu" | "game" | "game2">(
    "main-menu"
  );
  const [tier, setTier] = useState<TIERS_IDS>(TIERS_IDS.ALPHA);
  const handleJoin: ComponentProps<typeof MainMenu>["onJoin"] = (
    tier,
    userTwo
  ) => {
    setScreen(userTwo ? "game2" : "game");
    setTier(tier);
  };

  switch (screen) {
    case "main-menu":
      return <MainMenu onJoin={handleJoin} />;
    case "game":
      return (
        <Game user_id="40c1700b-eb11-480d-9948-df506645d9fc" tier={tier} />
      );
    case "game2":
      return (
        <Game user_id="6c79f7cc-e6ea-4c11-937e-6779b34b4d1c" tier={tier} />
      );
  }
}
