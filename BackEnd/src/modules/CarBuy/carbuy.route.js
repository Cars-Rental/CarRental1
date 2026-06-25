import express from "express";
import * as carbuy from "./carbuy.controller.js";
import upload from "../../utlis/cloudinary/multer.js";
import { auth } from "../../middleware/verifyToken.js";
import validation from "../../middleware/validation.middleware.js";
import * as carbuyvalidation from "./carbuy.validation.js";
import { Authorization } from "../../middleware/verifyToken.js";
const router = express.Router();
router.post(
  "/addcar",
  auth,
  Authorization(["Trader"]),
  upload.single("image"),
  validation(carbuyvalidation.addcar),
  carbuy.addcarTobuy,
);
router.get("/getall", carbuy.getcaralls);
router.get("/getbyid/:id", carbuy.getcarbyID);
router.patch(
  "/updatecar/:id",
  auth,
  upload.single("image"),
  validation(carbuyvalidation.updatecar),
  carbuy.updatecarbyid,
);
router.delete("/deletecar/:id", auth, carbuy.deletecar);
export default router;
