import express from "express";
const router = express.Router();

import { verifyToken } from "../middlewares/authValidation.js";

import {
  checkAuth,
  deleteUserById,
  getAllUsers,
  getUserById,
  login,
  logout,
  resetPassword,
  register,
  updateUserById,
  verifyUsername,
} from "../controllers/authController.js";

router.get("/", getAllUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUserById);
router.delete("/user/:id", deleteUserById);

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

router.post("/verify-username", verifyUsername);
router.put("/reset-password", resetPassword);
router.get("/check-auth", verifyToken, checkAuth);

export default router;
