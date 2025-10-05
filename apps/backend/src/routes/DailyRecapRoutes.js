import express from "express";
import {
  getRecaps,
  getLastRecap,
  getRecapByCode,
  createRecap,
  updateRecapByCode,
  deleteRecapByCode,
} from "../controllers/DailyRecapController.js";
import { validateSchema } from "../utils/validateSchema.js";
import { DailyRecapSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data rekapitulasi
 * @route GET /api/daily-recap
 */
router.get("/", getRecaps);

/**
 * * @desc Mendapatkan 1 data rekapitulasi terakhir
 * @route GET /api/daily-recap/last
 */
router.get("/last", getLastRecap);

/**
 * * @desc Mendapatkan satu data rekapitulasi berdasarkan Kode Unik
 * @route GET /api/daily-recap/:uniqueCode
 * @param uniqueCode - Kode Unik dari rekapitulasi yang dicari
 */
router.get("/:uniqueCode", getRecapByCode);

/**
 * * @desc Membuat data rekapitulasi baru
 * @route POST /api/daily-recap
 */
router.post("/", validateSchema(DailyRecapSchema), createRecap);

/**
 * * @desc Memperbarui data rekapitulasi berdasarkan Kode Unik
 * @route PUT /api/daily-recap/:uniqueCode
 * @param uniqueCode - Kode Unik dari rekapitulasi yang akan diperbarui
 */
router.put("/:uniqueCode", validateSchema(DailyRecapSchema), updateRecapByCode);

/**
 * * @desc Menghapus data rekapitulasi berdasarkan Kode Unik
 * @route DELETE /api/daily-recap/:uniqueCode
 * @param uniqueCode - Kode Unik dari rekapitulasi yang akan dihapus
 */
router.delete("/:uniqueCode", deleteRecapByCode);

export default router;
