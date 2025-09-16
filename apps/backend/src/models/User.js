import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    NIP: {
      type: Number,
      required: true,
      unique: true,
    },
    position: {
      type: String,
      required: true,
    },
    fullName: {
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
    },
    role: {
      type: String,
      enum: ["administrator", "user"],
      default: "user",
      required: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
