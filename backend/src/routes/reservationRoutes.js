// routes/reservations.js
import express from "express";
import { Reservation } from "../Model/Reservation.js";
const router = express.Router();

// Create reservation
router.post("/", async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one reservation by ID
router.get("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: "Not found" });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update reservation by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete reservation by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
