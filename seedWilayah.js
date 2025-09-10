import fs from "fs";
import mongoose from "mongoose";
import { Region } from "./apps/backend/src/models/Region.js";

async function seedWilayah() {
  try {
    // 2. Koneksi MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/ticketing");

    // 3. Baca file JSON hasil export
    const rawData = fs.readFileSync("wilayah.json", "utf-8");
    const parsed = JSON.parse(rawData);

    // 4. Ambil data di node table
    const wilayahData = parsed.find(obj => obj.type === "table").data;

    // 5. Ubah data → tambahkan level & parentCode
    const mapped = wilayahData.map(item => {
      const codeParts = item.kode.split(".");
      let level = "province";
      if (codeParts.length === 2) level = "regency";
      if (codeParts.length === 3) level = "district";
      if (codeParts.length === 4) level = "village";

      // parentCode = kode tanpa bagian terakhir
      const parentCode = codeParts.length > 1
        ? codeParts.slice(0, -1).join(".")
        : null;

      return {
        code: item.kode,
        name: item.nama,
        level,
        parentCode
      };
    });

    // 6. Masukkan ke MongoDB
    await Region.insertMany(mapped);
    console.log("✅ Berhasil insert data wilayah ke MongoDB!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error:", err);
    mongoose.connection.close();
  }
}

seedWilayah();
