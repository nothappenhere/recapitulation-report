import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DATABASE, // Database name from .env
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB: ", err.message);
    process.exit(1);
  }
};
