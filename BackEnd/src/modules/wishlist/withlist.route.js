import { Router } from "express";
import { auth } from "../../middleware/verifyToken.js";
import * as wishlist from "./wishlist.controller.js";
import validation from "../../middleware/validation.middleware.js";
import * as wishlistvalidation from "./withlist.validation.js";
const router = Router();

router.post(
  "/add",
  validation(wishlistvalidation.addToWishlistSchema),
  auth,
  wishlist.addToWishlist,
);
router.get("/", auth, wishlist.getWishlist);
router.delete(
  "/:carId",
  auth,
  validation(wishlistvalidation.removeWishlistSchema),
  wishlist.removeFromWishlist,
);
export default router;
