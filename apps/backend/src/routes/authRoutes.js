import express from "express";
import {
  login,
  register,
  verifyUsername,
  resetPassword,
  checkAuth,
  logout,
} from "../controllers/AuthController.js";
import { validateSchema } from "../utils/validateSchema.js";
import { validateToken } from "../utils/validateToken.js";
import {
  LoginSchema,
  RegisterSchema,
  VerifyUsernameSchema,
  ResetPasswordSchema,
} from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Login user
 * @route POST /api/auth/login
 */
router.post("/login", validateSchema(LoginSchema), login);

/**
 * * @desc Registrasi user
 * @route POST /api/auth/register
 */
router.post("/register", validateSchema(RegisterSchema), register);

/**
 * * @desc Verifikasi akun dengan username
 * @route POST /api/auth/verify-username
 */
router.post(
  "/verify-username",
  validateSchema(VerifyUsernameSchema),
  verifyUsername
);

/**
 * * @desc Reset password user
 * @route PUT /api/auth/reset-password
 */
router.put(
  "/reset-password",
  validateSchema(ResetPasswordSchema),
  resetPassword
);

/**
 * * @desc Cek apakah token autentikasi valid dan dapat digunakan (status login)
 * @route GET /api/auth/check-auth
 */
router.get("/check-auth", validateToken, checkAuth);

/**
 * * @desc Logout user
 * @route POST /api/auth/logout
 */
router.post("/logout", logout);

export default router;
