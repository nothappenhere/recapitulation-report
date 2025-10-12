import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { sendResponse } from "../utils/sendResponse.js";

/**
 * * @desc Mendapatkan seluruh data pengguna
 * @route GET /api/user-manage
 */
export const getUsers = async (_, res) => {
  try {
    const allUsers = await User.find()
      .sort({ createdAt: -1 })
      .select("-password");

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
    const oneUser = await User.findOne({ username: username });

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
      { ...oneUser._doc, password: undefined }
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
    const user = await User.findOne({ username });

    if (!user || user.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `Data pengguna dengan username ${username} tidak ditemukan`
      );
    }

    // Update field-field lain (selain password)
    const updateFields = { ...req.validatedData };

    // Periksa apakah NIP diubah
    if (
      updateFields.NIP && // hanya jika user mengisi NIP di body
      updateFields.NIP !== user.NIP // dan nilainya berbeda dari yang lama
    ) {
      // Cek apakah NIP baru sudah digunakan oleh pengguna lain
      const nipExists = await User.findOne({
        NIP: updateFields.NIP,
        username: { $ne: username }, // pastikan bukan user yang sedang diedit
      });

      if (nipExists) {
        return sendResponse(
          res,
          400,
          false,
          `Pengguna dengan NIP ${updateFields.NIP} telah terdaftar`
        );
      }

      // Jika belum digunakan, maka NIP lama akan digantikan otomatis nanti oleh Object.assign
    } else {
      // Jika NIP tidak diubah, hapus dari updateFields agar tidak ditimpa
      delete updateFields.NIP;
    }

    // Tangani perubahan password
    if (updateFields.newPassword && updateFields.newPassword.trim() !== "") {
      const hashedPassword = await bcrypt.hash(updateFields.newPassword, 10);
      updateFields.password = hashedPassword;
    }

    // Jangan sertakan field `newPassword` ke database
    delete updateFields.newPassword;

    // Lakukan update
    Object.assign(user, updateFields);
    await user.save();

    sendResponse(
      res,
      200,
      true,
      `Berhasil memperbarui data pengguna dengan username ${username}`,
      { ...user._doc, password: undefined }
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
