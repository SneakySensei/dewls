"use client";

import { socketManager } from "@/utils/websockets";
import { useEffect, useRef, useState } from "react";

type Props = {
    namespace: string;
    auth_token: string;
};
export default function useSocket({ namespace, auth_token }: Props) {
    const [connected, setConnected] = useState(false);

    const socketRef = useRef(
        socketManager.socket(`/${namespace}`, {
            auth: {
                token: auth_token,
            },
        }),
    );

    useEffect(() => {
        const socket = socketRef.current;

        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setConnected(true);
        }

        function onDisconnect() {
            setConnected(false);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.connect();

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.disconnect();
        };
    }, []);

    return { handle: socketRef.current, connected };
}
