import express from "express";
import * as auth from "./auth.controller.js";
import validation from "../../middleware/validation.middleware.js";
import * as authvalidation from "../auth/auth.validation.js";
import { emailExist } from "../../middleware/userExist.js";
import passport from "./passport.config.js";
import { googleRedirect, getProfile, logout } from "./auth.controller.js";
// import upload from "./../../middleware/multer.middleware.js";
import { auth as verifyToken } from "../../middleware/verifyToken.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleRedirect,
);

router.get("/profile", getProfile);
router.get("/logout", logout);
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
router.patch("/updatepassword", verifyToken, auth.updatePassword);
router.post("/reset-password", auth.resetpassword);
router.post("/forgot-password", auth.forgotPassword);
export default router;
