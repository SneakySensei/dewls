"use client";

import { API_BASE_URL } from "./constants/api.constant";
import { Manager } from "socket.io-client";

export const socketManager = new Manager(API_BASE_URL, {
    withCredentials: true,
    closeOnBeforeunload: true,
    autoConnect: false,
});
