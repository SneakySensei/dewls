"use client";

import { ComponentProps, useState } from "react";
import MainMenu from "./components/MainMenu";
import Game from "./components/Game";

export default function TicTacToe() {
  const [screen, setScreen] = useState<"main-menu" | "game">("main-menu");

  const handleJoin: ComponentProps<typeof MainMenu>["onJoin"] = (tier) => {
    setScreen("game");
  };

  switch (screen) {
    case "main-menu":
      return <MainMenu onJoin={handleJoin} />;
    case "game":
      return <Game />;
  }
}
