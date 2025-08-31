import mongoose from "mongoose";

const golonganSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Pelajar", "Umum", "Asing", "Khusus"],
      required: true,
    },
    ticketCount: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
  },
  { _id: false } // supaya tidak bikin _id baru untuk tiap subdoc
);

const WeeklyReportSchema = new mongoose.Schema(
  {
    visitDate: {
      type: Date,
      required: true,
    },
    categories: [golonganSchema], // ⬅️ breakdown per kategori
    totalRevenue: {
      type: Number,
      required: true,
    },
    totalVisitor: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const WeeklyReport = mongoose.model("WeeklyReport", WeeklyReportSchema);
