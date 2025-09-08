import mongoose from "mongoose";

const golonganSchema = new mongoose.Schema({
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

export const Golongan = mongoose.model("Golongan", golonganSchema);
