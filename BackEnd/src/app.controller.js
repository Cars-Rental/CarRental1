import ConnectDB from "./DB/db.connection.js";
import authroute from "../src/modules/auth/auth.route.js";
import adminRoute from "../src/modules/admin/admin.route.js";
import { globalErrorhandling } from "./utlis/response/error.response.js";
import session from 'express-session';
import passport from "passport";
import './modules/auth/passport.config.js';

import carsroute from "../src/modules/car/car.route.js";
import cors from "cors";
import ratelimit from "express-rate-limit";
const limiter = ratelimit({
  windowMs: 20 * 60 * 1000,
  max: 30,
  message: "too many request please try again after 20 min",
});

const bootstrap = (app, express) => {

  app.use(cors());
  app.use(express.json());

  app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/', (req, res) => {
    res.send(`
        <h2> Car Rental App</h2>
        <a href="/auth/google"> Sin With Google</a>
    `);
  });

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(limiter);
  app.use("/auth", authroute);
  app.use("/cars", carsroute);
  app.use("/admin", adminRoute);
  app.use(globalErrorhandling);

  ConnectDB();
};
export default bootstrap;
