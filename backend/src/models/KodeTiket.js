import mongoose from "mongoose";

// 1. Creata a Schema
const kodeTiketSchema = new mongoose.Schema(
  {
    kode: {
      type: String, // contoh: "1P", "2P", "500U"
      required: true,
      unique: true,
    },
    golongan: {
      type: String,
      enum: ["Pelajar", "Umum", "Asing", "Khusus"],
      required: true,
    },
    stokTiket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StokTiket", // relasi ke stok golongan
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "expired"],
      default: "available", // default tiket baru masih tersedia
    },
  },
  { timestamps: true }
);

// 2. Create a Model based on the Schema
export const KodeTiket = mongoose.model("KodeTiket", kodeTiketSchema);
