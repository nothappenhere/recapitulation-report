import express from "express";
import PenjualanTiket from "../models/PenjualanTiket.js";
import HargaTiket from "../models/HargaTiket.js";

const router = express.Router();

// Tambah data penjualan bulanan
router.post("/", async (req, res) => {
  try {
    const { bulan, tahun, detail } = req.body;

    // ambil master harga tiket
    const hargaList = await HargaTiket.find();
    const hargaMap = {};
    hargaList.forEach((h) => {
      hargaMap[h.golongan] = h.harga_satuan;
    });

    // hitung otomatis total pendapatan & total pengunjung
    let total_pengunjung = 0;
    let total_pendapatan = 0;

    const detailWithPendapatan = detail.map((item) => {
      const harga = hargaMap[item.golongan] || 0;
      const jumlah = item.jumlah_tiket || 0;

      total_pengunjung += jumlah;
      const pendapatan = jumlah * harga;
      total_pendapatan += pendapatan;

      return {
        golongan: item.golongan,
        jumlah_tiket: jumlah,
        total_pendapatan: pendapatan,
      };
    });

    // buat dokumen penjualan
    const penjualan = new PenjualanTiket({
      bulan,
      tahun,
      total_pengunjung,
      total_pendapatan, // 🔹 hasil akumulasi semua golongan
      detail: detailWithPendapatan,
    });

    await penjualan.save();
    res.status(201).json(penjualan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ambil semua data penjualan
router.get("/", async (req, res) => {
  const data = await PenjualanTiket.find();
  res.json(data);
});

export default router;
