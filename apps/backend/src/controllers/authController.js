import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { sendResponse } from "../utils/response.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

/**
 * @desc Login user menggunakan username dan password → generate JWT token & simpan di cookie
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  const { username, password } = req.validatedData;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return sendResponse(res, 400, false, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, 400, false, "Invalid credentials");
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    return sendResponse(res, 200, true, "Logged in successfully", {
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
 * @desc Registrasi user baru (dengan role: administrator atau user)
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
  const { NIP, position, fullName, username, password, role } =
    req.validatedData;

  try {
    const userExist = await User.findOne({
      $or: [{ username }, { NIP }],
    });
    if (userExist) {
      return sendResponse(res, 409, false, "User already exist");
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

    return sendResponse(res, 201, true, "User created successfully", {
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
 * @desc Cek apakah username sudah terdaftar di database
 * @route POST /api/auth/verify-account
 */
export const verifyAccount = async (req, res) => {
  const { username } = req.validatedData;

  try {
    const userExist = await User.findOne({ username });
    if (!userExist) {
      return sendResponse(res, 409, false, "Invalid credentials", {
        exist: false,
      });
    }

    return sendResponse(res, 200, true, "Registered user", { exist: true });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * @desc Reset password user berdasarkan username
 * @route PUT /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  const { username, password } = req.validatedData;

  try {
    const userExist = await User.findOne({ username });
    if (!userExist) {
      return sendResponse(res, 409, false, "Invalid credentials", {
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

    return sendResponse(res, 200, true, "Password reset successful");
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * @desc Mengecek apakah user yang sedang login valid berdasarkan JWT token
 * @route GET /api/auth/check-auth
 */
export const checkAuth = async (req, res) => {
  try {
    const userExist = await User.findById(req.userId).select("-password");
    if (!userExist) {
      return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(res, 200, true, "Check auth successful", {
      user: userExist,
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * @desc Logout user → menghapus token dari cookie
 * @route POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return sendResponse(res, 200, true, "Logged out successfully");
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};
