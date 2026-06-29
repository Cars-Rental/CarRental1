import ConnectDB from "./DB/db.connection.js";
import authroute from "../src/modules/auth/auth.route.js";
import adminRoute from "../src/modules/admin/admin.route.js";
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
import wishlistroute from "../src/modules/wishlist/withlist.route.js";
import dashboardroute from "../src/modules/Dashboard-trader/dashboard.route.js";
import reviewRoutes from "../src/modules/review/review.route.js";
import { userModel } from "./DB/model/user.model.js";
import { socketAuthMiddleware } from "./sockets/socket.auth.js";
import { registerChatEvents } from "./sockets/chat.socket.js";
import { addUser, removeUser, getAllOnlineUserIds } from "./sockets/onlineUsers.js";
dotenv.config();

import ratelimit from "express-rate-limit";
const limiter = ratelimit({
  windowMs: 20 * 60 * 1000,
  max: 100,
  message: "too many request please try again after 20 min",
});

const bootstrap = (app, express, io) => {  
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
  app.use("/dashboard", dashboardroute);
  app.use("/orders", orderroute);
  app.use("/carbuy", carbuy);
  app.use("/notifications", notificationroute);
  app.use("/orderBuy", orderBuy);
  app.use("/chat", chatroute);
  app.use("/wishlist", wishlistroute);
  app.use("/reviews", reviewRoutes );
  app.use(globalErrorhandling);

  app.set("io", io);

  io.use(socketAuthMiddleware);

  io.on("connection", async (socket) => {
    const userId = socket.user._id.toString();

    addUser(userId, socket.id);
    userModel.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id }).exec();
    socket.broadcast.emit("user:online", { userId });

    socket.emit("users:onlineList", {
      userIds: getAllOnlineUserIds(),
    });

    registerChatEvents(io, socket);
  });

  ConnectDB();
};

export default bootstrap;