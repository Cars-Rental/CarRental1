import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        return this.type === "group";
      },
    },

    type: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    avatar: { type: String },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

roomSchema.index({ members: 1, type: 1 });

export const roomModel = mongoose.model("Room", roomSchema);
