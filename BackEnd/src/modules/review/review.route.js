import express from "express";
import {
  createReview,
  getReviewsByCar,
  getUserReviews,
  updateReview,
  deleteReview,
  getReviewById,
} from "./review.controller.js";

const router = express.Router();


router.post("/", createReview);

router.get("/carRent/:carRentId", getReviewsByCar);


router.get("/my-reviews", getUserReviews);


router.get("/:reviewId", getReviewById);


router.put("/:reviewId", updateReview);


router.delete("/:reviewId", deleteReview);

export default router;