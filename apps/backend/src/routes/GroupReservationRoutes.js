import express from "express";
import {
  getGroupReservations,
  getGroupReservationByCode,
  createGroupReservation,
  updateGroupReservationByCode,
  deleteGroupReservationByCode,
} from "../controllers/GroupReservationController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { GroupReservationSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data reservasi rombongan
 * @route GET /api/group-reservation
 */
router.get("/", getGroupReservations);

/**
 * * @desc Mendapatkan satu data reservasi rombongan berdasarkan Kode Unik
 * @route GET /api/group-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi rombongan yang dicari
 */
router.get("/:uniqueCode", getGroupReservationByCode);

/**
 * * @desc Membuat data reservasi rombongan baru
 * @route POST /api/group-reservation
 */
router.post(
  "/",
  validateSchema(GroupReservationSchema),
  createGroupReservation
);

/**
 * * @desc Memperbarui data reservasi rombongan berdasarkan Kode Unik
 * @route PUT /api/group-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi rombongan yang akan diperbarui
 */
router.put(
  "/:uniqueCode",
  validateSchema(GroupReservationSchema),
  updateGroupReservationByCode
);

/**
 * * @desc Menghapus data reservasi rombongan berdasarkan Kode Unik
 * @route DELETE /api/group-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi rombongan yang akan dihapus
 */
router.delete("/:uniqueCode", deleteGroupReservationByCode);

export default router;
