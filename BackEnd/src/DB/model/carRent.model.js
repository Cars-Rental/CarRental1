import mongoose from "mongoose";

export const carRentSchema = new mongoose.Schema(
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
    carmodel: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      enum: [
        "Cairo",
        "Giza",
        "Alexandria",
        "Dakahlia",
        "Red Sea",
        "Beheira",
        "Fayoum",
        "Gharbia",
        "Ismailia",
        "Menoufia",
        "Minya",
        "Qalyubia",
        "New Valley",
        "Suez",
        "Aswan",
        "Assiut",
        "Beni Suef",
        "Port Said",
        "Damietta",
        "Sharkia",
        "South Sinai",
        "Kafr El Sheikh",
        "Matrouh",
        "Luxor",
        "Qena",
        "North Sinai",
        "Sohag",
      ],
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    distance: {
      type: String,
      trim: true,
      required: true,
    },
    carprice: {
      type: Number,
      required: true,
      min: 0,
    },
    fuel: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    },
    seatCount: {
      type: Number,
      enum: [4, 5, 7],
    },
    Body_Type: {
      type: String,
      enum: [
        "Sedan",
        "SUV",
        "Hatchback",
        "Coupe",
        "Pickup",
        "Van",
        "Convertible",
      ],
    },
    Transmission: {
      type: String,
      enum: ["Automatic", "Manual"],
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
      default: "avilable",
    },
  },
  { timestamps: true },
);

export const carModel = mongoose.model("carRent", carRentSchema);
