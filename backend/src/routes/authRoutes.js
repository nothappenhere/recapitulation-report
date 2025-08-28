import express from "express";
const router = express.Router();

import {
  validateLogin,
  validateRegister,
  validateUsernameExist,
  validateResetPassword,
  verifyToken,
} from "../middlewares/authValidation.js";

import {
  activeUsers,
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
router.get("/active-users", activeUsers);

export default router;
