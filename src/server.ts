import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { Request } from "express";

dotenv.config();
const PORT = process.env.PORT;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.APP_ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Client is connected to backend", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log("Server is listening on port ", PORT));

export default io;
