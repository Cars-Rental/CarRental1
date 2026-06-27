import mongoose from "mongoose";

export const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    cars: [
      {
        _id: false,
        car: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "cars.carModel",
        },
        carModel: {
          type: String,
          required: true,
          enum: ["carRent", "carBuy"],
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const wishlistModel = mongoose.model("wishlist", wishlistSchema);
