import { User } from "../models/User.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data pengguna
 * @route GET /api/user-manage
 */
export const getUsers = async (_, res) => {
  try {
    const allUsers = await User.find().sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      true,
      "Berhasil mendapatkan seluruh data pengguna",
      allUsers
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Mendapatkan satu data pengguna berdasarkan Username
 * @route GET /api/user-manage/:username
 * @param username - Username dari pengguna yang dicari
 */
export const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // Cari satu data dengan Username
    const oneUser = await User.find({ username: username });

    // Karena response API `data` adalah array, pastikan ada data dan ambil objek pertama
    if (!oneUser || oneUser.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data pengguna dengan username ${username} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil mendapatkan data pengguna dengan username ${username}`,
      oneUser[0]
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Memperbarui data pengguna berdasarkan Username
 * @route PUT /api/user-manage/:username
 * @param username - Username dari pengguna yang akan diperbarui
 */
export const updateUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // Pakai findOneAndUpdate agar update satu dokumen dan return data terbaru
    const updated = await User.findOneAndUpdate(
      { username: username },
      { ...req.validatedData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated || updated.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data pengguna dengan username ${username} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data pengguna dengan username ${username}`,
      updated
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Menghapus data pengguna berdasarkan Username
 * @route DELETE /api/user-manage/:username
 * @param username - Username dari pengguna yang akan dihapus
 */
export const deleteUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // Pakai findOneAndDelete untuk hapus satu dokumen
    const deleted = await User.findOneAndDelete({ username: username });

    if (!deleted || deleted.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data pengguna dengan username ${username} tidak ditemukan`
      );
    }

    sendResponse(
      res,
      200,
      true,
      `Berhasil menghapus data pengguna dengan username ${username}`
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};
