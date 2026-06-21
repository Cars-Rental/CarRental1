import express from "express";
import { config } from "dotenv";
import bootstrap from "./src/app.controller.js";
config();
const port = process.env.PORT;
const app = express();
bootstrap(app, express);
app.listen(port, "127.0.0.1", () => {
  console.log(`server is running on ${port}`);
});
