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

import carsroute from "../src/modules/car/car.route.js";

import ratelimit from "express-rate-limit";
const limiter = ratelimit({
  windowMs: 20 * 60 * 1000,
  max: 30,
  message: "too many request please try again after 20 min",
});

const bootstrap = (app, express) => {
  app.use(express.json());
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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
<<<<<<< HEAD
  app.use("/review", reviewRoute);
=======
  app.use("/orders", orderroute);
>>>>>>> 1dbcd1e0761b63de9a7597b13e853aa48055331e
  app.use(globalErrorhandling);

  ConnectDB();
};
export default bootstrap;
