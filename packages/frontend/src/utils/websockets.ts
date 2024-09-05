import { API_BASE_URL } from "./constants/api.constant";
import { Manager } from "socket.io-client";

export const getSocketManager = () =>
    new Manager(API_BASE_URL, {
        closeOnBeforeunload: true,
        withCredentials: true,
    });
