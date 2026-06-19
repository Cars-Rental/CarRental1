import mongoose from "mongoose";

export const carSchema = new mongoose.Schema(
  {
    carbrand: {
      type: String,
      required: true,
      trim: true,
    },
    carname: {
      type: String,
      required: true,
      trim: true,
    },
    carprice: {
      type: Number,
      required: true,
      min: 0,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    carimage: [String],
    isavailable: {
      type: String,
      enum: ["avilable", "regestred"],
    },
  },
  { timestamps: true },
);

export const carModel = mongoose.model("Car", carSchema);
