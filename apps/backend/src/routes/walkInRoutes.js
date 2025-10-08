import express from "express";
import {
  getWalkIns,
  getWalkInByCode,
  createWalkIn,
  updateWalkInByCode,
  deleteWalkInByCode,
} from "../controllers/WalkinController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { WalkInSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data kunjungan walk-in
 * @route GET /api/direct-reservation
 */
router.get("/", getWalkIns);

/**
 * * @desc Mendapatkan satu data kunjungan walk-in berdasarkan Kode Unik
 * @route GET /api/direct-reservation/:uniqueCode
 * @param uniqueCode - Kode unik dari kunjungan walk-in yang dicari
 */
router.get("/:uniqueCode", getWalkInByCode);

/**
 * * @desc Membuat data kunjungan walk-in baru
 * @route POST /api/direct-reservation
 */
router.post("/", validateSchema(WalkInSchema), createWalkIn);

/**
 * * @desc Memperbarui data kunjungan walk-in berdasarkan Kode Unik
 * @route PUT /api/direct-reservation/:uniqueCode
 * @param uniqueCode - Kode unik dari kunjungan walk-in yang akan diperbarui
 */
router.put("/:uniqueCode", validateSchema(WalkInSchema), updateWalkInByCode);

/**
 * * @desc Menghapus data kunjungan walk-in berdasarkan Kode Unik
 * @route DELETE /api/direct-reservation/:uniqueCode
 * @param uniqueCode - Kode unik dari kunjungan walk-in yang akan dihapus
 */
router.delete("/:uniqueCode", deleteWalkInByCode);

export default router;
