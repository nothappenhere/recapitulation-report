import mongoose from "mongoose";

const provinceSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: false }
);

export const Province = mongoose.model("Province", provinceSchema);
