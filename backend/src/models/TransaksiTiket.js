import mongoose from "mongoose";

// 1. Creata a Schema
const transaksiTiketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // relasi ke User (opsional kalau ada sistem user)
      required: false,
    },
    golongan: {
      type: String,
      enum: ["Pelajar", "Umum", "Asing", "Khusus"],
      required: true,
    },
    jumlah: {
      type: Number,
      required: true,
    },
    kode_tiket: [
      {
        type: String, // simpan kode tiket yang terbeli (misal: ["1P","2P","3P"])
        required: true,
      },
    ],
    total_harga: {
      type: Number,
      required: true,
    },
    status_transaksi: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

// 2. Create a Model based on the Schema
export const TransaksiTiket = mongoose.model(
  "TransaksiTiket",
  transaksiTiketSchema
);
