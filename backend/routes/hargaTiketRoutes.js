import express from "express";
import HargaTiket from "../models/HargaTiket.js";

const router = express.Router();

// Tambah harga tiket
router.post("/", async (req, res) => {
  try {
    const harga = new HargaTiket(req.body);
    await harga.save();
    res.status(201).json(harga);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ambil semua harga tiket
router.get("/", async (req, res) => {
  const data = await HargaTiket.find();
  res.json(data);
});

export default router;
