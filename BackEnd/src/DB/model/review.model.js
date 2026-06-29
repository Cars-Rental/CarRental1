import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",  
      required: true,
    },
    carRent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carRent",  
      required: true,
    },
    order: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "order",
  required: true,
},

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, carRent: 1 }, { unique: true });

export const reviewModel = mongoose.model("Review", reviewSchema);