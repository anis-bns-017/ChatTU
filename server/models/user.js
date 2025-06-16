import mongoose from "mongoose";
import { hash } from "bcryptjs"; // Use bcryptjs for hashing passwords
const { Schema, model, models } = mongoose;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    bio: {
      type: String,
      default: "This is my bio",
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // Only hash the password if it has been modified or is new
    this.password = await hash(this.password, 10);
  }

  next();
});

export const User = models.User || model("User", schema);
