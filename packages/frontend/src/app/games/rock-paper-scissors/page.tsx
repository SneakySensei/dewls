"use client";

import { ComponentProps, useState } from "react";
import MainMenu from "./components/MainMenu";
import { TIERS_IDS } from "common";
import dynamic from "next/dynamic";
import Game from "./components/Game";

const MainMenuClientComponent = dynamic(() => Promise.resolve(MainMenu), {
  ssr: false,
});

export default function TicTacToe() {
  const [screen, setScreen] = useState<"main-menu" | "game">("main-menu");
  const [tier, setTier] = useState<TIERS_IDS>(TIERS_IDS.ALPHA);
  const handleJoin: ComponentProps<typeof MainMenu>["onJoin"] = (tier) => {
    setScreen("game");
    setTier(tier);
  };

  switch (screen) {
    case "main-menu":
      return <MainMenuClientComponent onJoin={handleJoin} />;
    case "game":
      return <Game tier={tier} />;
  }
}
