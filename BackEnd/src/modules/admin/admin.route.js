import * as adminController from "./admin.controller.js";
import { Authorization } from "../../middleware/verifyToken.js";
import express from "express";
const router = express.Router();
import { auth } from "../../middleware/verifyToken.js";

router.get("/getAllUsers", adminController.getAllUsers);
// router.get("/getUser/:id", adminController.getUserById);
router.delete(
  "/deleteUser/:id",
  Authorization("Admin"),
  adminController.deleteUser,
);

export default router;
