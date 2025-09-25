import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    reservationNumber: { type: String, unique: true },
    agent: {
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
    reservationMechanism: {
      type: String,
      enum: ["Whatsapp", "Google Form", "Datang Langsung", "Lainnya"],
      default: "Lainnya",
    },
    description: { type: String, default: "-" },

    ordererName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    groupName: { type: String, required: true },

    studentMemberTotal: { type: Number, required: true, default: 0 },
    publicMemberTotal: { type: Number, required: true, default: 0 },
    foreignMemberTotal: { type: Number, required: true, default: 0 },
    visitorMemberTotal: { type: Number, required: true, default: 0 },

    actualMemberTotal: { type: Number, default: 0 },
    reservationStatus: {
      type: String,
      enum: ["Hadir", "Reschedule", "Batal Hadir", "Lainnya"],
      default: "Lainnya",
    },

    address: { type: String, required: true },
    province: { type: String, required: true },
    regencyOrCity: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, required: true },
    country: { type: String, required: true, default: "Indonesia" },

    studentTotalAmount: { type: Number, default: 0 },
    publicTotalAmount: { type: Number, default: 0 },
    foreignTotalAmount: { type: Number, default: 0 },
    totalPaymentAmount: { type: Number, default: 0 },

    paymentMethod: {
      type: String,
      enum: ["Tunai", "QRIS", "-"],
      default: "-",
    },
    downPayment: { type: Number, default: 0 },
    changeAmount: { type: Number, default: 0 },
    statusPayment: {
      type: String,
      enum: ["Lunas", "Belum Bayar"],
      default: "Belum Bayar",
    },
  },
  { timestamps: true }
);

// Middleware untuk auto-calculation
reservationSchema.pre("save", function (next) {
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
reservationSchema.pre("save", function (next) {
  // Ganti semua string kosong dengan default jika ada
  const fieldsWithDefault = ["description"];

  fieldsWithDefault.forEach((field) => {
    if (this[field] === "") {
      this[field] = "-";
    }
  });

  next();
});

// Middleware untuk generate reservationNumber acak 6 karakter (unik)
reservationSchema.pre("save", async function (next) {
  if (!this.reservationNumber) {
    try {
      const generateRandomCode = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return result;
      };

      let unique = false;
      let attempt = 0;
      const maxAttempts = 10;

      while (!unique && attempt < maxAttempts) {
        const randomCode = generateRandomCode();
        const candidate = `MG-${randomCode}`;

        const existing = await mongoose.models.Reservation.findOne({
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

export const Reservation = mongoose.model("Reservation", reservationSchema);
