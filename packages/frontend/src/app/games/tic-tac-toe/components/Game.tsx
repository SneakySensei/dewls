import { useEffect } from "react";
import { Manager } from "socket.io-client";

const socketManager = new Manager("localhost:8080", {withCredentials: true})
export default function Game() {
  useEffect(() => {
    const socket = socketManager.socket("tic-tac-toe", );
  }, []);
  return (
    <main>Game</main>
  )
}
