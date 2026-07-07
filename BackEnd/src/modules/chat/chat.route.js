import { Router } from "express";
import { getMyRooms, getRoomMessages, getAllUsers, getRoomById } from "./chat.controller.js";
import { auth } from "../../middleware/verifyToken.js";


const router = Router();

router.get("/rooms", auth, getMyRooms);
router.get("/rooms/:roomId", auth, getRoomById);
router.get("/rooms/:roomId/messages", auth, getRoomMessages);
router.get("/users", auth, getAllUsers);

export default router;
