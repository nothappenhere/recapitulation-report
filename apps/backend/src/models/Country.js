import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// menambahkan index agar query lebih cepat
countrySchema.index({ code: 1 });

export const Country = mongoose.model("Country", countrySchema);
