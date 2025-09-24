import mongoose from "mongoose";
import { CounterReservation } from "./CounterReservation.js";

const reservationSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, unique: true },

    reservationAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    visitingDate: { type: Date, required: true },
    visitingHour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisitingHour",
      required: true,
    },
    reservationMechanism: { type: String, required: true },
    description: { type: String, default: "-" },

    ordererNameOrTravelName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    groupName: { type: String, required: true },

    studentMemberTotal: { type: Number, default: 0, required: true },
    publicMemberTotal: { type: Number, default: 0, required: true },
    foreignMemberTotal: { type: Number, default: 0, required: true },
    groupMemberTotal: { type: Number, default: 0 },

    actualMemberTotal: { type: Number, default: 0 },
    reservationStatus: { type: String, default: "-" },

    address: { type: String, required: true },
    province: { type: String, default: "-" },
    regencyOrCity: { type: String, default: "-" },
    district: { type: String, default: "-" },
    village: { type: String, default: "-" },
    country: { type: String, default: "-" },

    paymentAmount: { type: Number, default: 0 },
    paymentMethod: { type: String, required: true },
    downPayment: { type: Number, default: 0, required: true },
    changeAmount: { type: Number, default: 0 },
    statusPayment: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

// Middleware untuk auto-calculation
reservationSchema.pre("save", function (next) {
  // Mengatur status pembayaran
  if (this.downPayment >= this.paymentAmount) {
    this.statusPayment = "Paid";
  } else {
    this.statusPayment = "Unpaid";
  }

  // Menghitung kembalian
  if (this.downPayment >= this.paymentAmount) {
    this.changeAmount = this.downPayment - this.paymentAmount;
  }

  // Mengatur total anggota group/kelompok
  this.groupMemberTotal =
    this.studentMemberTotal + this.publicMemberTotal + this.foreignMemberTotal;

  next();
});

// Middleware untuk menerapkan default value
reservationSchema.pre("save", function (next) {
  // Ganti semua string kosong dengan default jika ada
  const fieldsWithDefault = [
    "province",
    "regencyOrCity",
    "district",
    "village",
    "country",
    "description",
    "reservationStatus",
  ];

  fieldsWithDefault.forEach((field) => {
    if (this[field] === "") {
      this[field] = "-";
    }
  });

  next();
});

// Middleware untuk generate bookingNumber berurutan
reservationSchema.pre("save", async function (next) {
  if (!this.bookingNumber) {
    try {
      const counter = await CounterReservation.findOneAndUpdate(
        { name: "bookingNumber" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      // Format 6 digit dengan leading zero
      const formattedSeq = counter.seq.toString().padStart(6, "0");
      this.bookingNumber = `MGR-${formattedSeq}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export const Reservation = mongoose.model("Reservation", reservationSchema);
