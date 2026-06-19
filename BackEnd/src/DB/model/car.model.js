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
    carimage: [
      {
        secure_url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    isavailable: {
      type: String,
      enum: ["avilable", "regestred"],
    },
  },
  { timestamps: true },
);

export const carModel = mongoose.model("Car", carSchema);
