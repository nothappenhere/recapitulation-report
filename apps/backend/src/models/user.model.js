import mongoose from "mongoose";
import { number } from "zod";

//* Creata a Schema
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
  { timestamps: true } // createdAt & updatedAt
);

//* Create a Model based on the Schema
export const User = mongoose.model("User", userSchema);
