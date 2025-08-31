import express from "express";
const router = express.Router();

import {
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/authController.js";

router.get("/", getAllUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUserById);
router.delete("/user/:id", deleteUserById);

export default router;
