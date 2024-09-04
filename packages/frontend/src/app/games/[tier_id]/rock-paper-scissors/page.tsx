"use client";

import Game from "./components/Game";

type PageProps = { params: { tier_id: string } };

export default function TicTacToe({ params: { tier_id } }: PageProps) {
    return <Game tier_id={tier_id} />;
}
