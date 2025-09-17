import fs from "fs";
import mongoose from "mongoose";
import { Country } from "../models/Country.js";

async function seedCountries() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ticketing-system");
    console.log("Connected to MongoDB!");

    // baca file JSON
    const rawData = fs.readFileSync("./data/countries.json", "utf-8");
    const countriesObj = JSON.parse(rawData);

    // ubah dari object -> array of documents
    const countriesArray = Object.entries(countriesObj).map(([code, name]) => ({
      code,
      name,
    }));

    // hapus data lama
    await Country.deleteMany({});
    console.log("Old Country cleared!");

    // masukkan ke database
    await Country.insertMany(countriesArray);

    console.log("Countries seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding countries:", err.message);
    mongoose.connection.close();
  }
}

seedCountries();
