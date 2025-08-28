import express from "express";
import {
  getAllTicketPrice,
  getTicketPriceById,
  createTicketPrice,
  updateTicketPrice,
  deleteTicketPrice,
} from "../controllers/hargaTiketController.js";

const router = express.Router();

router.get("/", getAllTicketPrice);
router.get("/:id", getTicketPriceById);
router.post("/", createTicketPrice);
router.put("/:id", updateTicketPrice);
router.delete("/:id", deleteTicketPrice);

export default router;
