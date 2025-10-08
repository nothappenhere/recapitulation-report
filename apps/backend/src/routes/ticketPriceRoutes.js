import express from "express";
import {
  getTicketPrices,
  getTicketPriceByCategory,
  createTicketPrice,
  updateTicketPriceByCategory,
  deleteTicketPriceByCategory,
} from "../controllers/TicketPriceController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { TicketPriceSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data harga tiket
 * @route GET /api/ticket-price
 */
router.get("/", getTicketPrices);

/**
 * * @desc Mendapatkan satu data harga tiket berdasarkan Kategori
 * @route GET /api/ticket-price/:category
 * @param category - Kategori dari harga tiket yang dicari
 */
router.get("/:category", getTicketPriceByCategory);

/**
 * * @desc Membuat data harga tiket baru
 * @route POST /api/ticket-price
 */
router.post("/", validateSchema(TicketPriceSchema), createTicketPrice);

/**
 * * @desc Memperbarui data harga tiket berdasarkan Kategori
 * @route PUT /api/ticket-price/:category
 * @param category - Kategori dari harga tiket yang akan diperbarui
 */
router.put(
  "/:category",
  validateSchema(TicketPriceSchema),
  updateTicketPriceByCategory
);

/**
 * * @desc Menghapus data harga tiket berdasarkan Kategori
 * @route DELETE /api/ticket-price/:category
 * @param category - Kategori dari harga tiket yang akan dihapus
 */
router.delete("/:category", deleteTicketPriceByCategory);

export default router;
