import { Manager } from "socket.io-client";
import { API_BASE_URL } from "./constants/api.constant";

export const getSocketManager = () =>
  new Manager(API_BASE_URL, { withCredentials: true });
