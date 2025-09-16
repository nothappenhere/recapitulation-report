import express from "express";
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservationById,
  deleteReservationById,
} from "../controllers/reservationController.js";
import { validateSchema } from "../utils/validateSchema.js";
import { ReservationSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data reservasi
 * @route GET /api/reservation
 */
router.get("/", getReservations);

/**
 * * @desc Mendapatkan satu data reservasi berdasarkan ID
 * @route GET /api/reservation/:id
 * @param id - ID dari reservasi yang dicari
 */
router.get("/:id", getReservationById);

/**
 * * @desc Membuat data reservasi baru
 * @route POST /api/reservation
 */
router.post("/", validateSchema(ReservationSchema), createReservation);

/**
 * * @desc Memperbarui data reservasi berdasarkan ID
 * @route PUT /api/reservation/:id
 * @param id - ID dari reservasi yang akan diperbarui
 */
router.put("/:id", validateSchema(ReservationSchema), updateReservationById);

/**
 * * @desc Menghapus data reservasi berdasarkan ID
 * @route DELETE /api/reservation/:
 * @param id - ID dari reservasi yang akan dihapus
 */
router.delete("/:id", deleteReservationById);

export default router;
