import mongoose from "mongoose";
import { Reservation } from "../models/Reservation.js";
import { User } from "../models/User.js";
import { VisitingHour } from "../models/VisitingHour.js";

const seedReservations = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ticketing");
    console.log("Connected to MongoDB!");

    // ambil user pertama (anggap sudah ada user login)
    const user = await User.findOne();
    if (!user) {
      throw new Error("Belum ada user di database, buat dulu minimal 1 user.");
    }

    // ambil semua visitingHour (6 slot waktu)
    const visitingHours = await VisitingHour.find();
    if (visitingHours.length < 3) {
      throw new Error(
        "Slot visitingHour kurang, jalankan seedVisitingHour.js dulu."
      );
    }

    // hapus data lama
    await Reservation.deleteMany({});
    console.log("Old reservations cleared!");

    // buat 3 booking contoh
    const data = [
      {
        reservationAgent: user._id,
        ordererNameOrTravelName: "Asep Yayat",
        phoneNumber: "08123456789",
        groupName: "Yayasan XYZ",
        studentMemberTotal: 6,
        publicMemberTotal: 10,
        foreignMemberTotal: 1,
        customMemberTotal: 0,
        visitingDate: new Date("2025-09-12"),
        visitingHour: visitingHours[0]._id, // 09:00 - 10:00
        reservationMechanism: "WA",
        description: "-",
        paymentAmount: 93000,
        downPayment: 50000,
      },
      {
        reservationAgent: user._id,
        ordererNameOrTravelName: "Travel Barokah",
        phoneNumber: "628123456789",
        groupName: "SMA Negeri 1 Bandung",
        studentMemberTotal: 20,
        publicMemberTotal: 5,
        foreignMemberTotal: 0,
        customMemberTotal: 0,
        visitingDate: new Date("2025-09-12"),
        visitingHour: visitingHours[1]._id, // 10:00 - 11:00
        reservationMechanism: "G-form",
        description: "Kunjungan rombongan pelajar",
        paymentAmount: 85000,
        downPayment: 85000, // lunas
      },
      {
        reservationAgent: user._id,
        ordererNameOrTravelName: "Budi Santoso",
        phoneNumber: "081987654321",
        groupName: "Pribadi",
        studentMemberTotal: 0,
        publicMemberTotal: 2,
        foreignMemberTotal: 1,
        customMemberTotal: 0,
        visitingDate: new Date("2025-09-13"),
        visitingHour: visitingHours[2]._id, // 11:00 - 12:00
        reservationMechanism: "WA",
        description: "Rombongan kecil keluarga",
        paymentAmount: 35000,
        downPayment: 0,
      },
    ];

    // masukkan ke database
    const inserted = [];
    for (const item of data) {
      const doc = new Reservation(item);
      await doc.save();
      inserted.push(doc);
    }

    console.log("Reservations seeded:");
    inserted.forEach((doc) => {
      console.log(`- ${doc.bookingNumber}: ${doc.ordererNameOrTravelName}`);
    });

    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding reservations:", err.message);
    mongoose.connection.close();
  }
};

seedReservations();
