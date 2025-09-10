import mongoose from "mongoose";

const regionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    level: {
      type: String,
      enum: ["province", "regency", "district", "village"],
      required: true,
    },
    parentCode: { type: String },
  },
  { timestamps: true }
);

// ✅ tambahkan index agar query lebih cepat
regionSchema.index({ level: 1 });
regionSchema.index({ parentCode: 1 });

export const Region = mongoose.model("Regions", regionSchema);
