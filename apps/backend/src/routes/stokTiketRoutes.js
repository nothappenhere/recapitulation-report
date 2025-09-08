import express from "express";
import {
  getAllStockTicket,
  createStockTicket,
  updateStockTicket,
  deleteStockTicket,
} from "../controllers/stokTiketController.js";

const router = express.Router();

router.get("/", getAllStockTicket);
router.post("/", createStockTicket);
router.put("/:id", updateStockTicket);
router.delete("/:id", deleteStockTicket);

export default router;
