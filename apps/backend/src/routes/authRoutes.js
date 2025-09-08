import express from "express";
const router = express.Router();

import {
  checkAuth,
  login,
  logout,
  resetPassword,
  register,
  verifyAccount,
} from "../controllers/authController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyUsernameSchema,
} from "@rzkyakbr/schemas";
import { validateToken } from "../middlewares/validateToken.js";

/**
 * @desc Login user dengan validasi skema
 * @route POST /api/auth/login
 */
router.post("/login", validateSchema(loginSchema), login);

/**
 * @desc Registrasi user baru dengan validasi skema
 * @route POST /api/auth/register
 */
router.post("/register", validateSchema(registerSchema), register);

/**
 * @desc Verifikasi akun dengan validasi skema
 * @route POST /api/auth/verify-account
 */
router.post(
  "/verify-account",
  validateSchema(verifyUsernameSchema),
  verifyAccount
);

/**
 * @desc Reset password user dengan validasi skema
 * @route PUT /api/auth/reset-password
 */
router.put(
  "/reset-password",
  validateSchema(resetPasswordSchema),
  resetPassword
);

/**
 * @desc Cek apakah token autentikasi valid dan dapat digunakan (status login)
 * @route GET /api/auth/check-auth
 */
router.get("/check-auth", validateToken, checkAuth);

/**
 * @desc Logout user dari sistem
 * @route POST /api/auth/logout
 */
router.post("/logout", logout);

export default router;
