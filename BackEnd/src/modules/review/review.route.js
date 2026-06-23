import * as reviewController from "./review.controller.js";
import express from "express";
import {auth} from "../../middleware/verifyToken.js";
const router = express.Router();

// get all review 
router.get("/all", reviewController.getAllReviews);
// get review by id to car 
router.get("/:id", reviewController.getReviewById);
// delete review 
router.delete("/delete/:id", auth,reviewController.deleteReview);
// create review 
router.post("/add",auth ,reviewController.createReview);


export default router;