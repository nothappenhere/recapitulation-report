import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { sendResponse } from "../utils/sendResponse.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

/**
 * * @desc Login user
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  const { username, password } = req.validatedData;

  try {
    const user = await User.findOne({ username });
    if (!user || user.lenght === 0) {
      return sendResponse(res, 400, false, "kredensial tidak valid");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, 400, false, "kredensial tidak valid");
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    sendResponse(res, 200, true, "Logged in berhasil", {
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Registrasi user
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
  const { NIP, position, fullName, username, password, role } =
    req.validatedData;

  try {
    const userExist = await User.findOne({
      $or: [{ NIP }, { username }],
    });
    if (userExist) {
      return sendResponse(
        res,
        409,
        false,
        "Pengguna dengan NIP/username tersebut telah terdaftar"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      NIP,
      position,
      fullName,
      username,
      password: hashedPassword,
      role,
    });

    sendResponse(res, 201, true, "Berhasil membuat pengguna baru", {
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Verifikasi akun dengan username
 * @route POST /api/auth/verify-username
 */
export const verifyUsername = async (req, res) => {
  const { username } = req.validatedData;

  try {
    const userExist = await User.findOne({ username });
    if (!userExist || userExist.lenght === 0) {
      return sendResponse(res, 404, false, "Pengguna tidak ditemukan", {
        exist: false,
      });
    }

    sendResponse(res, 200, true, "Pengguna terdaftar", { exist: true });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Reset password user
 * @route PUT /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  const { username, password } = req.validatedData;

  try {
    const userExist = await User.findOne({ username });
    if (!userExist || userExist.lenght === 0) {
      return sendResponse(res, 404, false, "Pengguna tidak ditemukan", {
        exist: false,
      });
    }

    // New update password
    const newHashedPassword = await bcrypt.hash(password, 10);

    // Update credential
    await User.updateOne(
      { username },
      { $set: { password: newHashedPassword } }
    );

    sendResponse(res, 200, true, "Berhasil melakukan reset kata sandi");
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Cek apakah token autentikasi valid dan dapat digunakan (status login)
 * @route GET /api/auth/check-auth
 */
export const checkAuth = async (req, res) => {
  try {
    const userExist = await User.findById(req.userId).select("-password");
    if (!userExist || userExist.lenght === 0) {
      return sendResponse(res, 404, false, "Pengguna tidak ditemukan");
    }

    sendResponse(
      res,
      200,
      true,
      "Berhasil melakukan verifikasi otentikasi",
      userExist
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * * @desc Logout user
 * @route POST /api/auth/logout
 */
export const logout = async (_, res) => {
  try {
    res.clearCookie("token");
    sendResponse(res, 200, true, "Logged out berhasil");
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};
