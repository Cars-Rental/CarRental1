import express from "express";
import * as reviewController from "./review.controller.js";
import * as reviewValidation from "./review.validation.js";
import { auth } from "../../middleware/verifyToken.js";
import { validation } from "../../middleware/validation.js";

const router = express.Router();


// Get all reviews
router.get("/all", reviewController.getAllReviews);


// Get reviews by car id
router.get(
  "/:id",
  validation(reviewValidation.getReviewById),
  reviewController.getReviewById
);

// Delete review
router.delete(
  "/delete/:id",
  auth,
  validation(reviewValidation.deleteReview),
  reviewController.deleteReview
);

// Create review
router.post(
  "/add",
  auth,
  validation(reviewValidation.createReview),
  reviewController.createReview
);

export default router;

// // get all review 
// router.get("/all", reviewController.getAllReviews);
// // get review by id to car 
// router.get("/:id", reviewController.getReviewById);
// // delete review 
// router.delete("/delete/:id", auth,reviewController.deleteReview);
// // create review 
// router.post("/add",auth ,reviewController.createReview);