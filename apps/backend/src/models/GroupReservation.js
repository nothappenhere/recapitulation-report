import mongoose from "mongoose";
import { generateRandomCode } from "../utils/generateRandomCode.js";

const groupReservationSchema = new mongoose.Schema(
  {
    reservationNumber: { type: String, unique: true },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    visitingDate: { type: Date, required: true },
    visitingHour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisitingHour",
      required: true,
    },
    reservationMechanism: {
      type: String,
      enum: ["Whatsapp", "Google Form", "Datang Langsung", "Lainnya"],
      default: "Lainnya",
    },
    description: { type: String, default: "-" },

    ordererName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    groupName: { type: String, required: true },

    studentMemberTotal: { type: Number, required: true },
    publicMemberTotal: { type: Number, required: true },
    foreignMemberTotal: { type: Number, required: true },
    visitorMemberTotal: { type: Number, required: true },

    studentTotalAmount: { type: Number, required: true },
    publicTotalAmount: { type: Number, required: true },
    foreignTotalAmount: { type: Number, required: true },
    totalPaymentAmount: { type: Number, required: true },

    actualMemberTotal: { type: Number, default: 0 },
    reservationStatus: {
      type: String,
      enum: ["Hadir", "Reschedule", "Batal Hadir", "Lainnya"],
      default: "Lainnya",
    },

    address: { type: String, required: true },
    province: { type: String, default: "-" },
    regencyOrCity: { type: String, default: "-" },
    district: { type: String, default: "-" },
    village: { type: String, default: "-" },
    country: { type: String, default: "Indonesia" },

    paymentMethod: {
      type: String,
      enum: ["Tunai", "QRIS", "Lainnya"],
      default: "Lainnya",
    },
    downPayment: { type: Number },
    changeAmount: { type: Number },
    statusPayment: {
      type: String,
      enum: ["Lunas", "Belum Bayar"],
      default: "Belum Bayar",
    },
  },
  { timestamps: true }
);

// Middleware untuk auto-calculation
groupReservationSchema.pre("save", function (next) {
  // Mengatur status pembayaran
  if (this.downPayment >= this.totalPaymentAmount) {
    this.statusPayment = "Lunas";
  } else {
    this.statusPayment = "Belum Bayar";
  }

  // Menghitung kembalian
  if (this.downPayment >= this.paymentAmount) {
    this.changeAmount = this.downPayment - this.paymentAmount;
  }

  // Mengatur total anggota group/kelompok
  this.visitorMemberTotal =
    this.studentMemberTotal + this.publicMemberTotal + this.foreignMemberTotal;

  next();
});

// Middleware untuk menerapkan default value
groupReservationSchema.pre("save", function (next) {
  // Ganti semua string kosong dengan default jika ada
  const fieldsWithDefault = [
    "description",
    "province",
    "regencyOrCity",
    "district",
    "village",
  ];

  fieldsWithDefault.forEach((field) => {
    if (this[field] === "") {
      this[field] = "-";
    }
  });

  next();
});

// Middleware untuk generate reservationNumber acak 6 karakter (unik)
groupReservationSchema.pre("save", async function (next) {
  if (!this.reservationNumber) {
    try {
      let unique = false;
      let attempt = 0;
      const maxAttempts = 10;

      while (!unique && attempt < maxAttempts) {
        const randomCode = generateRandomCode();
        const candidate = `MG-${randomCode}`;

        const existing = await mongoose.models.GroupReservation.findOne({
          reservationNumber: candidate,
        });

        if (!existing) {
          this.reservationNumber = candidate;
          unique = true;
        }

        attempt++;
      }

      if (!unique) {
        throw new Error(
          "Failed to generate unique reservationNumber after multiple attempts."
        );
      }

      next();
    } catch (err) {
      return next(err);
    }
  } else {
    next();
  }
});

export const GroupReservation = mongoose.model(
  "GroupReservation",
  groupReservationSchema
);
