import express from "express";
import {
  getCustomReservations,
  getFileUpload,
  getCustomReservationByCode,
  createCustomReservation,
  updateCustomReservationByCode,
  deleteCustomReservationByCode,
} from "../controllers/CustomReservationController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { upload } from "../middlewares/uploads.js";
import { CustomReservationSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data reservasi khusus
 * @route GET /api/custom-reservation
 */
router.get("/", getCustomReservations);

/**
 * * @desc Mendapatkan data file hasil upload
 * @route GET /api/custom-reservation/file/:fileName
 * @param fileName - Nama file hasil upload yang dicari
 */
router.get("/file/:fileName", getFileUpload);

/**
 * * @desc Mendapatkan satu data reservasi khusus berdasarkan Kode Unik
 * @route GET /api/custom-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi khusus yang dicari
 */
router.get("/:uniqueCode", getCustomReservationByCode);

/**
 * * @desc Membuat data reservasi khusus baru
 * @route POST /api/custom-reservation
 */
router.post(
  "/",
  upload.array("attachments", 5),
  validateSchema(CustomReservationSchema),
  createCustomReservation
);

/**
 * * @desc Memperbarui data reservasi khusus berdasarkan Kode Unik
 * @route PUT /api/custom-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi khusus yang akan diperbarui
 */
router.put(
  "/:uniqueCode",
  upload.array("attachments", 5),
  validateSchema(CustomReservationSchema),
  updateCustomReservationByCode
);

/**
 * * @desc Menghapus data reservasi khusus berdasarkan Kode Unik
 * @route DELETE /api/custom-reservation/:uniqueCode
 * @param uniqueCode - Kode Unik dari reservasi khusus yang akan dihapus
 */
router.delete("/:uniqueCode", deleteCustomReservationByCode);

export default router;
