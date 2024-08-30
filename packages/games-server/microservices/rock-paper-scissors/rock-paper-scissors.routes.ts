import { type Socket } from "socket.io";

export const RockPaperScissorsRoutes = (socket: Socket) => {
    socket.on("waiting", (a) => {
        console.log(a);
    });
};
