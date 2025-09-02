import mongoose from "mongoose";

const hargaTiketSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Pelajar", "Umum", "Asing", "Khusus"],
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
});

export const HargaTiket = mongoose.model("HargaTiket", hargaTiketSchema);
