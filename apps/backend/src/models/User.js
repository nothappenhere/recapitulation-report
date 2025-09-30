import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    NIP: {
      type: Number,
      required: true,
      unique: true,
    },
    position: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    biography: {
      type: String,
      default: "-",
    },
    role: {
      type: String,
      enum: ["Administrator", "User"],
      default: "User",
      required: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Middleware untuk menerapkan default value
userSchema.pre("save", function (next) {
  // Ganti semua string kosong dengan default jika ada
  const fieldsWithDefault = ["biography"];

  fieldsWithDefault.forEach((field) => {
    if (this[field] === "") {
      this[field] = "-";
    }
  });

  next();
});

export const User = mongoose.model("User", userSchema);
