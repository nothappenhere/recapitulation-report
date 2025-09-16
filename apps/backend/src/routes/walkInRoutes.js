import express from "express";
import {
  getWalkIns,
  getWalkInById,
  createWalkIn,
  updateWalkInById,
  deleteWalkInById,
} from "../controllers/walkInController.js";
import { validateSchema } from "../utils/validateSchema.js";
import { WalkInSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data walk-in
 * @route GET /api/walk-in
 */
router.get("/", getWalkIns);

/**
 * * @desc Mendapatkan satu data walk-in berdasarkan ID
 * @route GET /api/walk-in/:id
 * @param id - ID dari walk-in yang dicari
 */
router.get("/:id", getWalkInById);

/**
 * * @desc Membuat data walk-in baru
 * @route POST /api/walk-in
 */
router.post("/", validateSchema(WalkInSchema), createWalkIn);

/**
 * * @desc Memperbarui data walk-in berdasarkan ID
 * @route PUT /api/walk-in/:id
 * @param id - ID dari walk-in yang akan diperbarui
 */
router.put("/:id", validateSchema(WalkInSchema), updateWalkInById);

/**
 * * @desc Menghapus data walk-in berdasarkan ID
 * @route DELETE /api/walk-in/:id
 * @param id - ID dari walk-in yang akan dihapus
 */
router.delete("/:id", deleteWalkInById);

export default router;
