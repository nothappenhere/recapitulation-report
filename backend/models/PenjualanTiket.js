import mongoose from "mongoose";

const PenjualanDetailSchema = new mongoose.Schema(
  {
    golongan: {
      type: String,
      enum: ["Pelajar", "Umum", "Asing", "Khusus"],
      required: true,
    },
    jumlah_tiket: {
      type: Number,
      default: 0,
    },
    total_pendapatan: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const PenjualanTiketSchema = new mongoose.Schema(
  {
    bulan: {
      type: String,
      enum: [
        "January",
        "February",
        "March",
        "April",
        "Mei",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      required: true,
    },
    tahun: {
      type: Number,
      required: true,
    },
    total_pengunjung: {
      type: Number,
      default: 0,
    },
    total_pendapatan: {
      type: Number,
      default: 0,
    },
    detail: {
      type: [PenjualanDetailSchema], // array of subdocuments
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("PenjualanTiket", PenjualanTiketSchema);
