import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    ordererName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: String, required: true },
    province: { type: String, required: true }, // simpan kode wilayah
    districtOrCity: { type: String, required: true }, // simpan kode wilayah
    subdistrict: { type: String, required: true }, // simpan kode wilayah
    village: { type: String, required: true }, // simpan kode wilayah
    groupName: { type: String },
    groupMemberTotal: { type: Number },
    reservationDate: { type: Date, required: true },
    downPayment: { type: Number, default: 0 },
    paymentAmount: { type: Number, default: 0 },
    reservationNumber: { type: Number, unique: true, required: true },
    salesNumber: { type: Number },
    visitingHour: { type: String }, // bisa diubah ke Date kalau perlu waktu jam lengkap
  },
  { timestamps: true }
);

export const Reservation = mongoose.model("Reservation", reservationSchema);
