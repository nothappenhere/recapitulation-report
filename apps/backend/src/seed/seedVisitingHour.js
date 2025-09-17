import mongoose from "mongoose";
import { VisitingHour } from "../models/VisitingHour.js";

const seedVisitingHours = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ticketing-system");
    console.log("Connected to MongoDB!");

    const timeSlots = [
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "12:00 - 13:00 (Istirahat)",
      "13:00 - 14:00",
      "14:00 - 15:00",
    ];

    // hapus data lama
    await VisitingHour.deleteMany({});
    console.log("Old visiting hours cleared!");

    // masukkan ke database
    await VisitingHour.insertMany(
      timeSlots.map((slot) => ({ timeRange: slot }))
    );

    console.log("Visiting hours seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding visiting hours:", err.message);
    mongoose.connection.close();
  }
};

seedVisitingHours();
