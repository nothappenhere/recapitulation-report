import mongoose from "mongoose";

// 1. Creata a Schema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
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

// 2. Create a Model based on the Schema
export const User = mongoose.model("User", userSchema);
