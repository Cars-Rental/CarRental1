import express from "express";
import * as auth from "./auth.controller.js";
import validation from "../../middleware/validation.middleware.js";
import * as authvalidation from "../auth/auth.validation.js";
import { emailExist } from "../../middleware/userExist.js";
const router = express.Router();

router.post(
  "/register",
  emailExist,
  validation(authvalidation.register),
  auth.register,
);
router.post("/login", validation(authvalidation.login), auth.login);

export default router;
