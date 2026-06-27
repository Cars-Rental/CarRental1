import express from "express";
import * as cars from "./carRent.controller.js";
const router = express.Router();
import { auth } from "../../middleware/verifyToken.js";
import validation from "../../middleware/validation.middleware.js";
import * as carvalidation from "./carRent.validation.js";
import upload from "../../utlis/cloudinary/multer.js";
import { Authorization } from "../../middleware/verifyToken.js";

router.post(
  "/addcars",
  auth,
  Authorization("Trader"),
  upload.array("image", 4),
  validation(carvalidation.addcar),
  cars.addcar,
);
router.delete(
  "/delete/:id",
  upload.single("image"),
  auth,
  Authorization("Trader"),
  cars.deletecar,
);
router.get("/getallcar", cars.getallcar);
router.patch(
  "/update/:id",
  auth,
  validation(carvalidation.updateCar),
  Authorization("Trader"),
  upload.single("image"),
  cars.updatecar,
);
router.get("/getbyid/:id", auth, cars.getbyid);
export default router;
