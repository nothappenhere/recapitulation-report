import express from "express";
import {PenjualanTiket} from "../models/PenjualanTiket.js";
import {HargaTiket} from "../models/HargaTiket.js";

const router = express.Router();

// 🔹 CREATE penjualan tiket (sudah kita buat sebelumnya)
router.post("/", async (req, res) => {
  try {
    const { bulan, tahun, detail } = req.body;

    const hargaList = await HargaTiket.find();
    const hargaMap = {};
    hargaList.forEach(h => {
      hargaMap[h.golongan] = h.harga_satuan;
    });

    let total_pengunjung = 0;
    let total_pendapatan = 0;

    const detailWithPendapatan = detail.map(item => {
      const harga = hargaMap[item.golongan] || 0;
      const jumlah = item.jumlah_tiket || 0;

      total_pengunjung += jumlah;
      const pendapatan = jumlah * harga;
      total_pendapatan += pendapatan;

      return {
        golongan: item.golongan,
        jumlah_tiket: jumlah,
        total_pendapatan: pendapatan
      };
    });

    const penjualan = new PenjualanTiket({
      bulan,
      tahun,
      total_pengunjung,
      total_pendapatan,
      detail: detailWithPendapatan
    });

    await penjualan.save();
    res.status(201).json(penjualan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 UPDATE penjualan tiket
router.put("/:id", async (req, res) => {
  try {
    const { bulan, tahun, detail } = req.body;

    const hargaList = await HargaTiket.find();
    const hargaMap = {};
    hargaList.forEach(h => {
      hargaMap[h.golongan] = h.harga_satuan;
    });

    let total_pengunjung = 0;
    let total_pendapatan = 0;

    const detailWithPendapatan = detail.map(item => {
      const harga = hargaMap[item.golongan] || 0;
      const jumlah = item.jumlah_tiket || 0;

      total_pengunjung += jumlah;
      const pendapatan = jumlah * harga;
      total_pendapatan += pendapatan;

      return {
        golongan: item.golongan,
        jumlah_tiket: jumlah,
        total_pendapatan: pendapatan
      };
    });

    const penjualan = await PenjualanTiket.findByIdAndUpdate(
      req.params.id,
      {
        bulan,
        tahun,
        total_pengunjung,
        total_pendapatan,
        detail: detailWithPendapatan
      },
      { new: true } // supaya return data terbaru setelah update
    );

    if (!penjualan) {
      return res.status(404).json({ error: "Data penjualan tidak ditemukan" });
    }

    res.json(penjualan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 GET all
router.get("/", async (req, res) => {
  try {
    const { bulan, tahun } = req.query;

    let filter = {};
    if (bulan) filter.bulan = bulan;
    if (tahun) filter.tahun = parseInt(tahun);

    const penjualan = await PenjualanTiket.find(filter);
    res.json(penjualan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 GET by ID
router.get("/:id", async (req, res) => {
  try {
    const penjualan = await PenjualanTiket.findById(req.params.id);
    if (!penjualan) {
      return res.status(404).json({ error: "Data penjualan tidak ditemukan" });
    }
    res.json(penjualan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await PenjualanTiket.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Data penjualan tidak ditemukan" });
    }
    res.json({ message: "Data penjualan berhasil dihapus", data: deleted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
