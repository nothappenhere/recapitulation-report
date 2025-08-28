import express from "express";
import {
  buyTicket,
  getAllKodeTiket,
  updateKodeTiketStatus,
} from "../controllers/kodeTiketController.js";

const router = express.Router();

router.get("/", getAllKodeTiket);
router.patch("/:id/status", updateKodeTiketStatus);
router.post("/buy", buyTicket);

export default router;
