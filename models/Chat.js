import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    message: {
      text: {
        type: String,
        trim: true,
        default: null,
      },
      img: {
        type: String,
        default: null,
      },
      emo: {
        type: String,
        default: null,
      },
    },
    status: {
      type: String,
      enum: ["sent", "seen", "unseen"],
      default: "sent",
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chat", chatSchema);
