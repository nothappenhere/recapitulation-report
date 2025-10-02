import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEventById,
  deleteEventById,
} from "../controllers/CalendarEventController.js";
import { validateSchema } from "../utils/validateSchema.js";
import { CalendarEventSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data acara
 * @route GET /api/calendar-event
 */
router.get("/", getEvents);

/**
 * * @desc Mendapatkan satu data acara berdasarkan ID
 * @route GET /api/calendar-event/:id
 * @param id - ID dari acara yang dicari
 */
router.get("/:id", getEventById);

/**
 * * @desc Membuat data acara baru
 * @route POST /api/calendar-event
 */
router.post("/", validateSchema(CalendarEventSchema), createEvent);

/**
 * * @desc Memperbarui data acara berdasarkan ID
 * @route PUT /api/calendar-event/:id
 * @param id - ID dari acara yang akan diperbarui
 */
router.put("/:id", validateSchema(CalendarEventSchema), updateEventById);

/**
 * * @desc Menghapus data acara berdasarkan ID
 * @route DELETE /api/calendar-event/:
 * @param id - ID dari acara yang akan dihapus
 */
router.delete("/:id", deleteEventById);

export default router;
