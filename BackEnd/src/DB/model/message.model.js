import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    content: {
      type: String,
      required: function () {
        return !this.attachment;
      },
    },

    attachment: {
      url: String,
      type: { type: String, enum: ["image", "file", "video"] },
    },

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ room: 1, createdAt: -1 });

export const messageModel = mongoose.model("Message", messageSchema);
