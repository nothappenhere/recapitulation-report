import mongoose from "mongoose";

const visitingHourSchema = new mongoose.Schema({
  timeRange: {
    type: String,
    enum: [
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "12:00 - 13:00 (Istirahat)",
      "13:00 - 14:00",
      "14:00 - 15:00",
    ],
    required: true,
  },
});

export const VisitingHour = mongoose.model("VisitingHour", visitingHourSchema);
