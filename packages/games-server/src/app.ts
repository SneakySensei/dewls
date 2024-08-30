import express, { Request, Response } from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { Server } from "socket.io";

// configures dotenv to work in your application
dotenv.config();

const IS_DEV = process.env.NODE_ENV === "development";
const PORT = process.env.PORT;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

io.on("connection", (socket) => {
  console.log("a user connected!");
});

// Strat the server
server
  .listen(PORT, () => {
    console.log(
      IS_DEV
        ? `Server started at http://localhost:${PORT}`
        : `Server running at PORT: ${PORT}`
    );
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
