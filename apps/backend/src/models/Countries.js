import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    countryCode: { type: String, required: true, unique: true },
    countryName: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Country = mongoose.model("Countries", countrySchema);
