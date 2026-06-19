import express from "express";
import * as cars from "./car.controller.js";
const router = express.Router();
import { auth } from "../../middleware/verifyToken.js";
import validation from "../../middleware/validation.middleware.js";
import * as carvalidation from "./car.validation.js";
router.post("/addcars", auth, validation(carvalidation.addcar), cars.addcar);
router.delete("/delete/:id", auth, cars.deletecar);
router.get("/getallcar", cars.getallcar);
router.patch(
  "/update/:id",
  validation(carvalidation.updadecar),
  cars.updatecar,
);
router.get("/getbyid/:id", cars.getbyid);
export default router;
