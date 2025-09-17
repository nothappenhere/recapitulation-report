import fs from "fs";
import mongoose from "mongoose";
import { Region } from "../models/Region.js";

async function seedRegions() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ticketing-system");
    console.log("Connected to MongoDB!");

    // baca file JSON
    const rawData = fs.readFileSync("./data/wilayah.json", "utf-8");
    const parsed = JSON.parse(rawData);

    // ambil data di node table
    const wilayahData = parsed.find((obj) => obj.type === "table").data;

    // ubah data → tambahkan level & parentCode
    const mapped = wilayahData.map((item) => {
      const codeParts = item.kode.split(".");
      let level = "province";
      if (codeParts.length === 2) level = "regency";
      if (codeParts.length === 3) level = "district";
      if (codeParts.length === 4) level = "village";

      // parentCode = kode tanpa bagian terakhir
      const parentCode =
        codeParts.length > 1 ? codeParts.slice(0, -1).join(".") : null;

      return {
        code: item.kode,
        name: item.nama,
        level,
        parentCode,
      };
    });

    // hapus data lama
    await Region.deleteMany({});
    console.log("Old Region cleared!");

    // masukkan ke database
    await Region.insertMany(mapped);

    console.log("Region seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding regions:", err.message);
    mongoose.connection.close();
  }
}

seedRegions();
