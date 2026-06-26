import jwt from "jsonwebtoken";
import { userModel } from "../DB/model/user.model.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("NO_TOKEN"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new Error("TOKEN_EXPIRED"));
      }
      return next(new Error("INVALID_TOKEN"));
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return next(new Error("USER_NOT_FOUND"));
    }

    socket.user = user;
    next();
  } catch (err) {
    return next(new Error("UNAUTHORIZED"));
  }
};
