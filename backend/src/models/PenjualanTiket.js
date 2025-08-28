import mongoose from "mongoose";

// 1. Creata a Schema
const penjualanDetailSchema = new mongoose.Schema(
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

// 1. Creata a Schema
const penjualanTiketSchema = new mongoose.Schema(
  {
    tanggal_kunjungan: {
      type: Date,
      required: true,
    },
    bulan: {
      type: String,
      enum: [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ],
      required: true,
    },
    tahun: {
      type: Number,
      required: true,
    },
    total_pengunjung: {
      type: Number,
      required: true,
      default: 0,
    },
    total_pendapatan: {
      type: Number,
      required: true,
      default: 0,
    },
    detail: {
      type: [penjualanDetailSchema], // array of subdocuments
      required: true,
      default: [],
    },
  },
  { timestamps: true } // createdAt & updatedAt
);

// 2. Create a Model based on the Schema
export const PenjualanTiket = mongoose.model(
  "PenjualanTiket",
  penjualanTiketSchema
);
