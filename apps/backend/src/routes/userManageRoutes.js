import express from "express";
import {
  getUsers,
  getUserByUsername,
  updateUserByUsername,
  deleteUserByUsername,
} from "../controllers/UserManageController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { UserUpdateSchema } from "@rzkyakbr/schemas";

const router = express.Router();

/**
 * * @desc Mendapatkan seluruh data pengguna
 * @route GET /api/user-manage
 */
router.get("/", getUsers);

/**
 * * @desc Mendapatkan satu data pengguna berdasarkan Username
 * @route GET /api/user-manage/:username
 * @param username - Username dari pengguna yang dicari
 */
router.get("/:username", getUserByUsername);

/**
 * * @desc Memperbarui data pengguna berdasarkan Username
 * @route PUT /api/user-manage/:username
 * @param username - Username dari pengguna yang akan diperbarui
 */
router.put(
  "/:username",
  validateSchema(UserUpdateSchema),
  updateUserByUsername
);

/**
 * * @desc Menghapus data pengguna berdasarkan Username
 * @route DELETE /api/user-manage/:username
 * @param username - Username dari pengguna yang akan dihapus
 */
router.delete("/:username", deleteUserByUsername);

export default router;
