import mongoose from "mongoose";

export const carbuySchema = new mongoose.Schema(
  {
    carbrand: {
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
      required: true,
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
    distance: {
      type: String,
      trim: true,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
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
  },

  { timestamps: true },
);

export const carbuymodel = mongoose.model("carBuy", carbuySchema);
