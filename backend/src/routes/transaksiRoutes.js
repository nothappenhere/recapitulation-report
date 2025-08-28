import express from "express";
import {
  getAllTransactions,
  getTransactionById,
  deleteTransaction,
  getRekapPenjualan,
  getRekapTahunan,
} from "../controllers/transaksiController.js";

const router = express.Router();

// GET semua transaksi
router.get("/", getAllTransactions);

// GET transaksi by ID
router.get("/:id", getTransactionById);

// DELETE transaksi (opsional, kalau perlu admin bisa hapus data)
router.delete("/:id", deleteTransaction);

router.get("/rekap", getRekapPenjualan);      // 🔹 per bulan
router.get("/rekap-tahunan", getRekapTahunan); // 🔹 per tahun

export default router;
