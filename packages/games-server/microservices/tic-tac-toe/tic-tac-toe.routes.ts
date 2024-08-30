import { WSService } from "../../services/ws.service";

WSService.getIOServer("tic-tac-toe").on("waiting", (a) => {
    console.log(a);
});
