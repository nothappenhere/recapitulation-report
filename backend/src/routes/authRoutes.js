import express from "express";
const router = express.Router();

import { verifyToken } from "../middlewares/authValidation.js";
import {
  checkAuth,
  login,
  logout,
  resetPassword,
  register,
  verifyAccount,
} from "../controllers/authController.js";

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

router.post("/verify-account", verifyAccount);
router.put("/reset-password", resetPassword);
router.get("/check-auth", verifyToken, checkAuth);

export default router;
