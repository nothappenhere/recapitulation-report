import express from "express";
import {
  getTicketPrices,
  getTicketPriceById,
  createTicketPrice,
  updateTicketPriceById,
  deleteTicketPriceById,
} from "../controllers/hargaTiketController.js";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data harga tiket
 * @route GET /api/ticket-price
 * @access Public
 */
router.get("/", getTicketPrices);

/**
 * * @desc Mendapatkan satu data harga tiket berdasarkan ID
 * @route GET /api/ticket-price/:id
 * @param id - ID dari reservasi yang dicari
 * @access Public
 */
router.get("/:id", getTicketPriceById);

/**
 * * @desc Membuat harga tiket baru
 * @route POST /api/ticket-price
 * @access Public
 */
router.post("/", createTicketPrice);

/**
 * * @desc Memperbarui data harga tiket berdasarkan ID
 * @route PUT /api/ticket-price/:id
 * @param id - ID dari reservasi yang akan diperbarui
 * @access Public
 */
router.put("/:id", updateTicketPriceById);

/**
 * * @desc Menghapus harga tiket berdasarkan ID
 * @route DELETE /api/reservations/:id
 * @param id - ID dari reservasi yang akan dihapus
 * @access Public
 */
router.delete("/:id", deleteTicketPriceById);

export default router;
