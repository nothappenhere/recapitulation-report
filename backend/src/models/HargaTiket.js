import mongoose from "mongoose";

// 1. Creata a Schema
const hargaTiketSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      enum: ["Pelajar", "Umum", "Asing", "Khusus"],
      required: true,
      unique: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

// 2. Create a Model based on the Schema
export const HargaTiket = mongoose.model("HargaTiket", hargaTiketSchema);
