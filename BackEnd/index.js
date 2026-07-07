import express from "express";
import http from "http";
import bootstrap from "./src/app.controller.js";
import { initSocket } from "./src/sockets/index.js";

const app = express();

const server = http.createServer(app);

const io = initSocket(server);
bootstrap(app, express, io);

server.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});