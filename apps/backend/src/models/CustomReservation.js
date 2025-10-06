import mongoose from "mongoose";

const customReservationSchema = new mongoose.Schema(
  {
    customReservationNumber: { type: String, unique: true },
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
    description: { type: String, default: "-" },

    attachments: [
      {
        originalName: String,
        encoding: String,
        mimeType: String,
        fileName: String,
        size: Number,
        path: String,
      },
    ],

    ordererName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    groupName: { type: String, required: true },

    publicMemberTotal: { type: Number, required: true, default: 0 },
    customMemberTotal: { type: Number, required: true, default: 0 },
    visitorMemberTotal: { type: Number, required: true, default: 0 },

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

    publicTotalAmount: { type: Number, default: 0 },
    customTotalAmount: { type: Number, default: 0 },
    totalPaymentAmount: { type: Number, default: 0 },

    paymentMethod: {
      type: String,
      enum: ["Tunai", "QRIS", "Lainnya"],
      default: "Lainnya",
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
customReservationSchema.pre("save", function (next) {
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
  this.visitorMemberTotal = this.publicMemberTotal + this.customMemberTotal;

  next();
});

// Middleware untuk menerapkan default value
customReservationSchema.pre("save", function (next) {
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

// Middleware untuk generate customReservationNumber acak 6 karakter (unik)
customReservationSchema.pre("save", async function (next) {
  if (!this.customReservationNumber) {
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
        const candidate = `MGR-${randomCode}`;

        const existing = await mongoose.models.CustomReservation.findOne({
          customReservationNumber: candidate,
        });

        if (!existing) {
          this.customReservationNumber = candidate;
          unique = true;
        }

        attempt++;
      }

      if (!unique) {
        throw new Error(
          "Failed to generate unique customReservationNumber after multiple attempts."
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

export const CustomReservation = mongoose.model(
  "CustomReservation",
  customReservationSchema
);
