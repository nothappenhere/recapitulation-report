import express from "express";
import {
  getReservations,
  getReservationById,
  createReservation,
  updateReservationById,
  deleteReservationById,
} from "../controllers/bookingReservationController.js";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data reservasi
 * @route GET /api/booking-reservation
 */
router.get("/", getReservations);

/**
 * * @desc Mendapatkan satu data reservasi berdasarkan ID
 * @route GET /api/booking-reservation/:id
 */
router.get("/:id", getReservationById);

/**
 * * @desc Membuat reservasi baru
 * @route POST /api/booking-reservation
 */
router.post("/", createReservation);

/**
 * * @desc Memperbarui data reservasi berdasarkan ID
 * @route PUT /api/booking-reservation/:id
 */
router.put("/:id", updateReservationById);

/**
 * * @desc Menghapus reservasi berdasarkan ID
 * @route DELETE /api/booking-reservation/:id
 */
router.delete("/:id", deleteReservationById);

export default router;
