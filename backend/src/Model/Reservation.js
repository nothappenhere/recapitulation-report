import mongoose from "mongoose";
import { Counter } from "./Counter.js"; // import counter

// Mapping kategori → kode singkat
const categoryCodes = {
  Pelajar: "P",
  Umum: "U",
  Asing: "A",
  Khusus: "K",
};

const reservationSchema = new mongoose.Schema(
  {
    reservationNumber: { type: String, unique: true, required: false },
    salesNumber: { type: String, unique: true, required: false },

    category: {
      type: String,
      enum: ["Pelajar", "Umum", "Asing", "Khusus"],
      required: true,
    },

    reservationDate: { type: Date, default: Date.now, required: true },
    visitingHour: { type: String, required: true },

    ordererName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    groupName: { type: String, required: true },
    groupMemberTotal: { type: Number, required: true },

    province: { type: String, required: true },
    regencyOrCity: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, required: true },

    paymentAmount: { type: Number, default: 0, required: true },
    downPayment: { type: Number, default: 0, required: true },
    changeAmount: { type: Number, default: 0, required: true },
    statusPayment: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
      required: true,
    },
  },
  { timestamps: true }
);

// Hook generate nomor pakai counter
reservationSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const categoryCode = categoryCodes[this.category];
      if (!categoryCode) {
        return next(new Error("Invalid category"));
      }

      // Ambil dan update counter berdasarkan kategori
      const counter = await Counter.findByIdAndUpdate(
        this.category, // gunakan kategori sebagai _id
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const paddedNumber = String(counter.seq).padStart(7, "0"); // ← tambahkan padding

      // Set nomor reservasi dan nomor penjualan
      this.reservationNumber = `R.${categoryCode}${paddedNumber}`;
      this.salesNumber = `${categoryCode}${paddedNumber}`;
    }
    next();
  } catch (err) {
    next(err);
  }
});

export const Reservation = mongoose.model("Reservation", reservationSchema);
