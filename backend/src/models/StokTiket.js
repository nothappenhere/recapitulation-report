import mongoose from "mongoose";

// 1. Creata a Schema
const stokTiketSchema = new mongoose.Schema(
  {
    golongan: {
      type: String,
      enum: ["Pelajar", "Umum", "Asing", "Khusus"],
      required: true,
      unique: true,
    },
    jumlah_tiket: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

// 2. Create a Model based on the Schema
export const StokTiket = mongoose.model("StokTiket", stokTiketSchema);
