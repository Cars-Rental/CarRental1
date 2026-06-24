import express from "express";
import * as cars from "./carRent.controller.js";
const router = express.Router();
import { auth } from "../../middleware/verifyToken.js";
import validation from "../../middleware/validation.middleware.js";
import * as carvalidation from "./carRent.validation.js";
import upload from "../../utlis/cloudinary/multer.js";
router.post(
  "/addcars",
  auth,
  upload.single("image"),
  validation(carvalidation.addcar),
  cars.addcar,
);
router.delete("/delete/:id", upload.single("iamge"), auth, cars.deletecar);
router.get("/getallcar", cars.getallcar);
router.patch(
  "/update/:id",
  auth,
  validation(carvalidation.updadecar),
  upload.single("image"),
  cars.updatecar,
);
router.get("/getbyid/:id", cars.getbyid);
export default router;
