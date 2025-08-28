import express from "express";
import {
  getAllTicketPrice,
  createTicketPrice,
  updateTicketPrice,
  deleteTicketPrice,
} from "../controllers/hargaTiketController.js";

const router = express.Router();

router.get("/", getAllTicketPrice);
router.post("/", createTicketPrice);
router.put("/:id", updateTicketPrice);
router.delete("/:id", deleteTicketPrice);

export default router;
