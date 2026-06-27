import joi from "joi";

export const createReview = joi.object({
    userId: joi.string().hex().length(24).required().messages({
        "string.empty": "User ID is required",
        "string.hex": "User ID must be a valid ObjectId",
        "string.length": "User ID must be 24 characters long",
        "any.required": "User ID is required",
    }),

    carId: joi.string().hex().length(24).required().messages({
        "string.empty": "Car ID is required",
        "string.hex": "Car ID must be a valid ObjectId",
        "string.length": "Car ID must be 24 characters long",
        "any.required": "Car ID is required",
    }),

    comment: joi.string().min(3).max(500).required().messages({
        "string.empty": "Comment is required",
        "string.min": "Comment must be at least 3 characters",
        "string.max": "Comment must not exceed 500 characters",
        "any.required": "Comment is required",
    }),

    rating: joi.number().min(1).max(5).required().messages({
        "number.base": "Rating must be a number",
        "number.min": "Rating must be at least 1",
        "number.max": "Rating must not exceed 5",
        "any.required": "Rating is required",
    }),
});

export const getReviewById = joi.object({
    id: joi.string().hex().length(24).required().messages({
        "string.empty": "Car ID is required",
        "string.hex": "Car ID must be a valid ObjectId",
        "string.length": "Car ID must be 24 characters long",
        "any.required": "Car ID is required",
    }),
});

export const deleteReview = joi.object({
    id: joi.string().hex().length(24).required().messages({
        "string.empty": "Review ID is required",
        "string.hex": "Review ID must be a valid ObjectId",
        "string.length": "Review ID must be 24 characters long",
        "any.required": "Review ID is required",
    }),
});