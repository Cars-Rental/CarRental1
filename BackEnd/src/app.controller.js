import ConnectDB from "./DB/db.connection.js";
import authroute from "../src/modules/auth/auth.route.js";
import { globalErrorhandling } from "./utlis/response/error.response.js";
import session from 'express-session';
import passport from "passport";
import './modules/auth/passport.config.js';

import cors from "cors";
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

  app.use("/auth", authroute);
  app.use(globalErrorhandling);

  ConnectDB();
};
export default bootstrap;
