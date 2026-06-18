import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 40,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: 6,
      maxLength: 1024,
    },
    role: {
      type: String,
      enum: ["User", "Admin", "Trader"],
      default: "User",
    },
    confirmPassword: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 40,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const userModel = mongoose.model("user", userSchema);
