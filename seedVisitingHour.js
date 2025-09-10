import mongoose from "mongoose";
import { VisitingHour } from "./apps/backend/src/models/VisitingHour.js"; // sesuaikan path model

// 🔧 Ganti dengan connection string MongoDB kamu
const MONGO_URI = "mongodb://127.0.0.1:27017/ticketing";

const seedVisitingHours = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const timeSlots = [
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "12:00 - 13:00 (Istirahat)",
      "13:00 - 14:00",
      "14:00 - 15:00",
    ];

    // Hapus data lama biar bersih (opsional)
    await VisitingHour.deleteMany({});
    console.log("🗑️ Old visiting hours cleared");

    // Insert semua slot
    const inserted = await VisitingHour.insertMany(
      timeSlots.map((slot) => ({ timeRange: slot }))
    );

    console.log("✅ Visiting hours seeded:", inserted);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding visiting hours:", err);
    process.exit(1);
  }
};

seedVisitingHours();
