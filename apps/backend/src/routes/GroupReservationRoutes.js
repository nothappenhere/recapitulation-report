import express from "express";
import {
  getReservations,
  getReservationByCode,
  createReservation,
  updateReservationByCode,
  deleteReservationByCode,
} from "../controllers/GroupReservationController.js";
import { validateSchema } from "../utils/validateSchema.js";
import { GroupReservationSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data reservasi
 * @route GET /api/group-reservation
 */
router.get("/", getReservations);

/**
 * * @desc Mendapatkan satu data reservasi berdasarkan Kode Unik
 * @route GET /api/group-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi yang dicari
 */
router.get("/:uniqueCode", getReservationByCode);

/**
 * * @desc Membuat data reservasi baru
 * @route POST /api/group-reservation
 */
router.post("/", validateSchema(GroupReservationSchema), createReservation);

/**
 * * @desc Memperbarui data reservasi berdasarkan Kode Unik
 * @route PUT /api/group-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi yang akan diperbarui
 */
router.put(
  "/:uniqueCode",
  validateSchema(GroupReservationSchema),
  updateReservationByCode
);

/**
 * * @desc Menghapus data reservasi berdasarkan Kode Unik
 * @route DELETE /api/group-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi yang akan dihapus
 */
router.delete("/:uniqueCode", deleteReservationByCode);

export default router;
