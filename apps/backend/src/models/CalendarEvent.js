import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "-" },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    startHour: { type: String, default: "-" },
    endHour: { type: String, default: "-" },

    allDay: { type: Boolean, default: false },
    color: {
      type: String,
      enum: ["sky", "amber", "violet", "rose", "emerald", "orange"],
      required: true,
      default: "sky",
    },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

// Middleware untuk menerapkan default value
calendarEventSchema.pre("save", function (next) {
  // Ganti semua string kosong dengan default jika ada
  const fieldsWithDefault = ["description", "startHour", "endHour"];

  fieldsWithDefault.forEach((field) => {
    if (this[field] === "") {
      this[field] = "-";
    }
  });

  next();
});

export const CalendarEvent = mongoose.model(
  "CalendarEvent",
  calendarEventSchema
);
