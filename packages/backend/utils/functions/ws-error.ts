import { ErrorEvent } from "common";
import { Socket } from "socket.io";

export const WSError = (socket: Socket, error: any) => {
    console.error(error);
    const errorEvent: ErrorEvent = {
        type: "error",
        payload: error,
    };
    socket.emit(errorEvent.type, errorEvent.payload);
};
