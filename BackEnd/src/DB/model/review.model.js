import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    // bookingId:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "order",
    //     required: true,
    // },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "car",
        required: true,
    },
    comment: {
    type: String,
    required: [true, "Comment is required"],
    maxlength: [200, "Comment must not exceed 200 characters"]
    },
    rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must not exceed 5"]
    }
},
    {
        timestamps: true
    });

export const reviewModel = mongoose.model("review", reviewSchema);