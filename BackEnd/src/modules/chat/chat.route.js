import { Router } from "express";
import { getMyRooms, getRoomMessages, getAllUsers, getRoomById } from "./chat.controller.js";
import { Authorization } from "../../middleware/verifyToken.js";


const router = Router();

router.get("/rooms", Authorization, getMyRooms);
router.get("/rooms/:roomId", Authorization, getRoomById);
router.get("/rooms/:roomId/messages", Authorization, getRoomMessages);
router.get("/users", Authorization, getAllUsers);

export default router;
