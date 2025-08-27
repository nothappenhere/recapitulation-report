import mongoose from "mongoose";

const HargaTiketSchema = new mongoose.Schema(
  {
    golongan: {
      type: String,
      enum: ["Pelajar", "Umum", "Asing", "Khusus"],
      required: true,
      unique: true,
    },
    harga_satuan: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("HargaTiket", HargaTiketSchema);
