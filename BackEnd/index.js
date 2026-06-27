import express from "express";
import http from "http";
import { Server } from "socket.io";
import bootstrap from "./src/app.controller.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
bootstrap(app, express, io);

server.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});