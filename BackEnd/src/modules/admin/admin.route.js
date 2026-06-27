import { Authorization } from "../../middleware/verifyToken.js";
import * as adminController from "./admin.controller.js";

import express from "express";
const router = express.Router();

router.get("/getAllUsers", Authorization("Admin"), adminController.getAllUsers);
router.delete(
  "/deleteUser/:id",
  Authorization("Admin"),
  adminController.deleteUser,
);
//dont forget to delete trader
export default router;
