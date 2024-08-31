import { Manager } from "socket.io-client";

export const getSocketManager = () =>
  new Manager("localhost:8000", { withCredentials: true });
