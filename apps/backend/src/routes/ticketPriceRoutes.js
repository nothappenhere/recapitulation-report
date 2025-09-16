import express from "express";
import {
  getTicketPrices,
  getTicketPriceById,
  createTicketPrice,
  updateTicketPriceById,
  deleteTicketPriceById,
} from "../controllers/ticketPriceController.js";
import { validateSchema } from "../utils/validateSchema.js";
import { TicketPriceSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data harga tiket
 * @route GET /api/ticket-price
 */
router.get("/", getTicketPrices);

/**
 * * @desc Mendapatkan satu data harga tiket berdasarkan ID
 * @route GET /api/ticket-price/:id
 * @param id - ID dari harga tiket yang dicari
 */
router.get("/:id", getTicketPriceById);

/**
 * * @desc Membuat data harga tiket baru
 * @route POST /api/ticket-price
 */
router.post("/", validateSchema(TicketPriceSchema), createTicketPrice);

/**
 * * @desc Memperbarui data harga tiket berdasarkan ID
 * @route PUT /api/ticket-price/:id
 * @param id - ID dari harga tiket yang akan diperbarui
 */
router.put("/:id", validateSchema(TicketPriceSchema), updateTicketPriceById);

/**
 * * @desc Menghapus data harga tiket berdasarkan ID
 * @route DELETE /api/ticket-price/:id
 * @param id - ID dari harga tiket yang akan dihapus
 */
router.delete("/:id", deleteTicketPriceById);

export default router;
