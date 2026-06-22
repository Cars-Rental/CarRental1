import express from "express";
import * as auth from "./auth.controller.js";
import validation from "../../middleware/validation.middleware.js";
import * as authvalidation from "../auth/auth.validation.js";
import { emailExist } from "../../middleware/userExist.js";
// import upload from "./../../middleware/multer.middleware.js";

const router = express.Router();

router.post(
  "/register",
  emailExist,
  validation(authvalidation.register),
  auth.register,
);
router.post("/login", validation(authvalidation.login), auth.login);
// router.post("/uploads", upload.single("image"), (req, res, next) => {
//   console.log("file uploaded");
//   return res.status(200).json({
//     message: "File uploaded successfully",
//     file: req.file,
//   });
// });

router.post("/refresh-token", auth.refreshToken);
router.post("/verifyemail/:id", auth.VerifyEmail);
router.patch("/updatepassword/:id", auth.updatePasswordtonewONe);
export default router;
