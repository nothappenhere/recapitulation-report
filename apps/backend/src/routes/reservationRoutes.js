import express from "express";
import {
  getReservations,
  getReservationByCode,
  createReservation,
  updateReservationByCode,
  deleteReservationByCode,
} from "../controllers/ReservationController.js";
import { validateSchema } from "../utils/validateSchema.js";
import { ReservationSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data reservasi
 * @route GET /api/reservation
 */
router.get("/", getReservations);

/**
 * * @desc Mendapatkan satu data reservasi berdasarkan Kode Unik
 * @route GET /api/reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi yang dicari
 */
router.get("/:uniqueCode", getReservationByCode);

/**
 * * @desc Membuat data reservasi baru
 * @route POST /api/reservation
 */
router.post("/", validateSchema(ReservationSchema), createReservation);

/**
 * * @desc Memperbarui data reservasi berdasarkan Kode Unik
 * @route PUT /api/reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi yang akan diperbarui
 */
router.put("/:uniqueCode", validateSchema(ReservationSchema), updateReservationByCode);

/**
 * * @desc Menghapus data reservasi berdasarkan Kode Unik
 * @route DELETE /api/reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi yang akan dihapus
 */
router.delete("/:uniqueCode", deleteReservationByCode);

export default router;
