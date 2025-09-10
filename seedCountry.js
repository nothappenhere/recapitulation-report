import fs from "fs";
import mongoose from "mongoose";
import { Country } from "./apps/backend/src/models/Countries.js"; // path ke model kamu

async function seedCountries() {
  try {
    // konek ke MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/ticketing");

    // baca file JSON
    const rawData = fs.readFileSync("./countries.json", "utf-8");
    const countriesObj = JSON.parse(rawData);

    // ubah dari object -> array of documents
    const countriesArray = Object.entries(countriesObj).map(([code, name]) => ({
      countryCode: code,
      countryName: name,
    }));

    // masukkan ke database
    await Country.insertMany(countriesArray);

    console.log("✅ Countries inserted successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding countries:", err);
  }
}

seedCountries();
