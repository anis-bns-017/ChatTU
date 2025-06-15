import mongoose from "mongoose";

// Destructure necessary parts from mongoose
const { Schema, model, models, Types } = mongoose;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Export the model safely (prevents model overwrite in dev)
export const Chat = models.Chat || model("Chat", schema);
