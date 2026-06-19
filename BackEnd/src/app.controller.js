import ConnectDB from "./DB/db.connection.js";
import authroute from "../src/modules/auth/auth.route.js";
import adminRoute from "../src/modules/admin/admin.route.js";
import { globalErrorhandling } from "./utlis/response/error.response.js";
import carsroute from "../src/modules/car/car.route.js";
import cors from "cors";
import ratelimit from "express-rate-limit";
const limiter = ratelimit({
  windowMs: 20 * 60 * 1000,
  max: 30,
  message: "too many request please try again after 20 min",
});

const bootstrap = (app, express) => {
  app.use(express.json());
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(limiter);
  app.use("/auth", authroute);
  app.use("/admin", adminRoute);
  app.use(globalErrorhandling);
  ConnectDB();
};
export default bootstrap;
