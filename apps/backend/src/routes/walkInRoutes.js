import express from "express";
import {
  getWalkIns,
  getWalkInByCode,
  createWalkIn,
  updateWalkInByCode,
  deleteWalkInByCode,
} from "../controllers/WalkinController.js";
import { validateSchema } from "../utils/validateSchema.js";
import { WalkInSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data kunjungan walk-in
 * @route GET /api/walk-in
 */
router.get("/", getWalkIns);

/**
 * * @desc Mendapatkan satu data kunjungan walk-in berdasarkan Kode Unik
 * @route GET /api/walk-in/:uniqueCode
 * @param uniqueCode - Kode unik dari kunjungan walk-in yang dicari
 */
router.get("/:uniqueCode", getWalkInByCode);

/**
 * * @desc Membuat data kunjungan walk-in baru
 * @route POST /api/walk-in
 */
router.post("/", validateSchema(WalkInSchema), createWalkIn);

/**
 * * @desc Memperbarui data kunjungan walk-in berdasarkan Kode Unik
 * @route PUT /api/walk-in/:uniqueCode
 * @param uniqueCode - Kode unik dari kunjungan walk-in yang akan diperbarui
 */
router.put("/:uniqueCode", validateSchema(WalkInSchema), updateWalkInByCode);

/**
 * * @desc Menghapus data kunjungan walk-in berdasarkan Kode Unik
 * @route DELETE /api/walk-in/:uniqueCode
 * @param uniqueCode - Kode unik dari kunjungan walk-in yang akan dihapus
 */
router.delete("/:uniqueCode", deleteWalkInByCode);

export default router;
