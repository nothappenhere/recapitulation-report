import express from "express";
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservationById,
  deleteReservationById,
} from "../controllers/reservationController.js";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data reservasi
 * @route GET /api/reservations
 * @access Public
 */
router.get("/", getReservations);

/**
 * * @desc Mendapatkan satu data reservasi berdasarkan ID
 * @route GET /api/reservations/:id
 * @param id - ID dari reservasi yang dicari
 * @access Public
 */
router.get("/:id", getReservationById);

/**
 * * @desc Membuat reservasi baru
 * @route POST /api/reservations
 * @access Public
 */
router.post("/", createReservation);

/**
 * * @desc Memperbarui data reservasi berdasarkan ID
 * @route PUT /api/reservations/:id
 * @param id - ID dari reservasi yang akan diperbarui
 * @access Public
 */
router.put("/:id", updateReservationById);

/**
 * * @desc Menghapus reservasi berdasarkan ID
 * @route DELETE /api/reservations/:id
 * @param id - ID dari reservasi yang akan dihapus
 * @access Public
 */
router.delete("/:id", deleteReservationById);

export default router;
