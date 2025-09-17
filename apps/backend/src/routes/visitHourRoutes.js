import express from "express";
import { getVisitHours } from "../controllers/visitHourController.js";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data waktu kunjungan museum
 * @route GET /api/visit-hour
 */
router.get("/", getVisitHours);

export default router;
