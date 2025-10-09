import express from "express";
import {
  getDirectReservations,
  getDirectReservationByCode,
  createDirectReservation,
  updateDirectReservationByCode,
  deleteDirectReservationByCode,
} from "../controllers/DirectReservationController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { DirectReservation } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data reservasi langsung
 * @route GET /api/direct-reservation
 */
router.get("/", getDirectReservations);

/**
 * * @desc Mendapatkan satu data reservasi langsung berdasarkan Kode Unik
 * @route GET /api/direct-reservation/:uniqueCode
 * @param uniqueCode - Kode unik dari reservasi langsung yang dicari
 */
router.get("/:uniqueCode", getDirectReservationByCode);

/**
 * * @desc Membuat data reservasi langsung baru
 * @route POST /api/direct-reservation
 */
router.post("/", validateSchema(DirectReservation), createDirectReservation);

/**
 * * @desc Memperbarui data reservasi langsung berdasarkan Kode Unik
 * @route PUT /api/direct-reservation/:uniqueCode
 * @param uniqueCode - Kode unik dari reservasi langsung yang akan diperbarui
 */
router.put(
  "/:uniqueCode",
  validateSchema(DirectReservation),
  updateDirectReservationByCode
);

/**
 * * @desc Menghapus data reservasi langsung berdasarkan Kode Unik
 * @route DELETE /api/direct-reservation/:uniqueCode
 * @param uniqueCode - Kode unik dari reservasi langsung yang akan dihapus
 */
router.delete("/:uniqueCode", deleteDirectReservationByCode);

export default router;
