import mongoose from "mongoose";
import { reviewModel } from "../../DB/model/review.model.js";

// Get all reviews
export const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await reviewModel
            .find()
            .populate("userId", "userName email phone gender role");

        res.status(200).json({
            success: true,
            message: "All reviews retrieved successfully",
            data: reviews,
        });
    } catch (error) {
        next(error);
    }
};

// Get reviews by car id
export const getReviewById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const reviews = await reviewModel
            .find({ carId: id })
            .populate("userId", "name email");

        res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully",
            data: reviews,
        });
    } catch (error) {
        next(error);
    }
};

// Create review
export const createReview = async (req, res, next) => {
    try {
        const { userId, carId, comment, rating } = req.body;

        const review = await reviewModel.create({
            userId,
            carId,
            comment,
            rating,
        });

        const populatedReview = await reviewModel
            .findById(review._id)
            .populate("userId", "name email");

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: populatedReview,
        });
    } catch (error) {
        next(error);
    }
};

// Delete review
export const deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;

        const review = await reviewModel
            .findByIdAndDelete(id)
            .populate("userId", "name email");

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: review,
        });
    } catch (error) {
        next(error);
    }
};




// {
//   "success": true,
//   "message": "All reviews retrieved successfully",
//   "data": [
//     {
//       "_id": "686...",
//       "comment": "Very good car",
//       "rating": 5,
//       "carId": "685...",
//       "userId": {
//         "_id": "684...",
//         "userName": "Youssef",
//         "email": "youssef@gmail.com",
//         "phone": "01012345678",
//         "gender": "Male",
//         "role": "User"
//       }
//     }
//   ]
// }