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

    // Attach the full user document but also ensure `id` is available as string
    socket.user = user;
    try {
      // in some places code expects `socket.user.id` (plain string)
      socket.user.id = user._id.toString();
    } catch (e) {
      // ignore if not possible
    }
    next();
  } catch (err) {
    return next(new Error("UNAUTHORIZED"));
  }
};
