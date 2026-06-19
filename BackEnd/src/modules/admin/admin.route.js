import * as adminController from "./admin.controller.js";

import express from "express";
const router = express.Router();

router.get("/getAllUsers", adminController.getAllUsers);
router.get("/getUser/:id", adminController.getUserById);
router.delete("/deleteUser/:id", adminController.deleteUser);

export default router;
