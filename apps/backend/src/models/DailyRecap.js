import mongoose from "mongoose";

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

    studentMemberTotal: { type: Number, required: true, default: 0 },
    publicMemberTotal: { type: Number, required: true, default: 0 },
    foreignMemberTotal: { type: Number, required: true, default: 0 },
    visitorMemberTotal: { type: Number, required: true, default: 0 },

    studentTotalAmount: { type: Number, default: 0 },
    publicTotalAmount: { type: Number, default: 0 },
    foreignTotalAmount: { type: Number, default: 0 },
    totalPaymentAmount: { type: Number, default: 0 },

    initialStudentSerialNumber: { type: Number, required: true, default: 0 },
    finalStudentSerialNumber: { type: Number, required: true, default: 0 },
    initialPublicSerialNumber: { type: Number, required: true, default: 0 },
    finalPublicSerialNumber: { type: Number, required: true, default: 0 },
    initialForeignSerialNumber: { type: Number, required: true, default: 0 },
    finalForeignSerialNumber: { type: Number, required: true, default: 0 },
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
        const candidate = `MGDR-${randomCode}`;

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
