import mongoose from "mongoose";
import { Counter } from "./Counter.js";

const bookingReservationSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, required: false, unique: true },

    reservationAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ordererNameOrTravelName: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    groupName: { type: String, required: true },
    studentMemberTotal: { type: Number, default: 0, required: true },
    publicMemberTotal: { type: Number, default: 0, required: true },
    foreignMemberTotal: { type: Number, default: 0, required: true },
    customMemberTotal: { type: Number, default: 0, required: true },
    groupMemberTotal: { type: Number, default: 0, required: true },

    visitingDate: { type: Date, required: true },
    visitingHour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisitingHour",
      required: true,
    },
    reservationMechanism: { type: String, required: true },
    description: { type: String, default: "-" },

    address: { type: String, required: true },
    province: { type: String, required: true },
    regencyOrCity: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, required: true },

    paymentAmount: { type: Number, default: 0, required: true },
    downPayment: { type: Number, default: 0, required: true },
    changeAmount: { type: Number, default: 0 },
    statusPayment: {
      type: String,
      enum: ["Paid", "DP", "Unpaid"],
      default: "Unpaid",
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware untuk auto-update status pembayaran
bookingReservationSchema.pre("save", function (next) {
  if (this.downPayment >= this.paymentAmount) {
    this.statusPayment = "Paid";
  } else if (this.downPayment > 0 && this.downPayment < this.paymentAmount) {
    this.statusPayment = "DP";
  } else {
    this.statusPayment = "Unpaid";
  }

  this.groupMemberTotal =
    this.studentMemberTotal +
    this.publicMemberTotal +
    this.foreignMemberTotal +
    this.customMemberTotal;

  if (this.downPayment >= this.paymentAmount) {
    this.changeAmount = this.downPayment - this.paymentAmount;
  }

  next();
});

// Middleware untuk generate bookingNumber berurutan
bookingReservationSchema.pre("save", async function (next) {
  if (!this.bookingNumber) {
    try {
      const counter = await Counter.findOneAndUpdate(
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

export const BookingReservation = mongoose.model(
  "BookingReservation",
  bookingReservationSchema
);
