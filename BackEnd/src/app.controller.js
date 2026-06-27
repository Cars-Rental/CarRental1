import ConnectDB from "./DB/db.connection.js";
import authroute from "../src/modules/auth/auth.route.js";
import adminRoute from "../src/modules/admin/admin.route.js";
import reviewRoute from "../src/modules/review/review.route.js";
import orderroute from "./modules/order/order.route.js";
import { globalErrorhandling } from "./utlis/response/error.response.js";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import "./modules/auth/passport.config.js";
import carbuy from "./modules/CarBuy/carbuy.route.js";
import carsroute from "./modules/carRent/carRent.route.js";
import notificationroute from "./modules/notification/notification.route.js";
import orderBuy from "./modules/orderBuy/orderBuy.route.js";
import chatroute from "./modules/chat/chat.route.js";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

import ratelimit from "express-rate-limit";
const limiter = ratelimit({
  windowMs: 20 * 60 * 1000,
  max: 30,
  message: "too many request please try again after 20 min",
});

const bootstrap = (app, express) => {
  app.use(express.json());
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(
    session({
      secret: "your_secret_key",
      resave: false,
      saveUninitialized: true,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/", (req, res) => {
    res.send(`
        <h2> Car Rental App</h2>
        <a href="/auth/google"> Sin With Google</a>
    `);
  });

  app.use(limiter);
  app.use("/auth", authroute);
  app.use("/cars", carsroute);
  app.use("/admin", adminRoute);
  app.use("/review", reviewRoute);
  app.use("/orders", orderroute);
  app.use("/carbuy", carbuy);
  app.use("/notifications", notificationroute);
  app.use("/orderBuy", orderBuy);
  app.use("/orserBuy", orderBuy);
  app.use("/chat", chatroute);
  app.use(globalErrorhandling);

  ConnectDB();
};
export default bootstrap;
