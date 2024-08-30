"use client";
import { io } from "socket.io-client";

import { useEffect } from "react";

export default function TicTacToe() {
  useEffect(() => {
    const socket = io("localhost:8080", { withCredentials: true });
  }, []);
  return <main>page</main>;
}
