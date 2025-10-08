import mongoose from "mongoose";
import { generateRandomCode } from "../utils/generateRandomCode.js";

const dailyRecapSchema = new mongoose.Schema(
  {
    recapNumber: { type: String, unique: true },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recapDate: { type: Date, required: true },
    description: { type: String, default: "-" },

    studentMemberTotal: { type: Number, required: true },
    publicMemberTotal: { type: Number, required: true },
    foreignMemberTotal: { type: Number, required: true },
    visitorMemberTotal: { type: Number, required: true },

    studentTotalAmount: { type: Number, required: true },
    publicTotalAmount: { type: Number, required: true },
    foreignTotalAmount: { type: Number, required: true },
    totalPaymentAmount: { type: Number, required: true },

    initialStudentSerialNumber: { type: Number, required: true },
    finalStudentSerialNumber: { type: Number, required: true },
    initialPublicSerialNumber: { type: Number, required: true },
    finalPublicSerialNumber: { type: Number, required: true },
    initialForeignSerialNumber: { type: Number, required: true },
    finalForeignSerialNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

// Middleware untuk auto-calculation
dailyRecapSchema.pre("save", function (next) {
  // Mengatur total anggota group/kelompok
  this.visitorMemberTotal =
    this.studentMemberTotal + this.publicMemberTotal + this.foreignMemberTotal;

  next();
});

// Middleware untuk menerapkan default value
dailyRecapSchema.pre("save", function (next) {
  // Ganti semua string kosong dengan default jika ada
  const fieldsWithDefault = ["description"];

  fieldsWithDefault.forEach((field) => {
    if (this[field] === "") {
      this[field] = "-";
    }
  });

  next();
});

// Middleware untuk generate recapNumber acak 6 karakter (unik)
dailyRecapSchema.pre("save", async function (next) {
  if (!this.recapNumber) {
    try {
      let unique = false;
      let attempt = 0;
      const maxAttempts = 10;

      while (!unique && attempt < maxAttempts) {
        const randomCode = generateRandomCode();
        const candidate = `MGRH-${randomCode}`;

        const existing = await mongoose.models.GroupReservation.findOne({
          recapNumber: candidate,
        });

        if (!existing) {
          this.recapNumber = candidate;
          unique = true;
        }

        attempt++;
      }

      if (!unique) {
        throw new Error(
          "Failed to generate unique recapNumber after multiple attempts."
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

export const DailyRecap = mongoose.model("DailyRecap", dailyRecapSchema);
