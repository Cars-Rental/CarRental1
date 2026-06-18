import ConnectDB from "./DB/db.connection.js";
import authroute from "../src/modules/auth/auth.route.js";
import { globalErrorhandling } from "./utlis/response/error.response.js";
import cors from "cors";
const bootstrap = (app, express) => {
  app.use(express.json());
  app.use("/auth", authroute);
  app.use(globalErrorhandling);
  app.use(cors());
  ConnectDB();
};
export default bootstrap;
