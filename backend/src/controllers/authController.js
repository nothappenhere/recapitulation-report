import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { sendResponse } from "../utils/response.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

/**
 * @desc Login user → generate JWT token & simpan di cookie
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  const { username, password } = req.body;

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
 * @desc Register / signup user baru (role: administrator | user)
 * @route POST /api/auth/signup
 */
export const register = async (req, res) => {
  const { fullName, username, password, role } = req.body;

  try {
    if (!fullName || !username || !password || !role) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    const allowedRoles = ["administrator", "user"];
    if (!allowedRoles.includes(role)) {
      return sendResponse(res, 400, false, "Invalid role");
    }

    const userAlreadyExists = await User.findOne({ username });
    if (userAlreadyExists) {
      return sendResponse(res, 409, false, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
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
 * @desc Logout user → hapus token dari cookie
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

/**
 * @desc Verifikasi apakah akun sudah terdaftar di database
 * @route POST /api/auth/verify-account
 */
export const verifyAccount = async (req, res) => {
  const { username } = req.body;

  try {
    const userAlreadyExists = await User.findOne({ username });
    if (!userAlreadyExists) {
      return sendResponse(res, 404, false, "Unregistered user", {
        exists: false,
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
 * @desc Reset password user 
 * @route PUT /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userAlreadyExists = await User.findOne({ username });
    if (!userAlreadyExists) {
      return sendResponse(res, 404, false, "Unregistered user", {
        exists: false,
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
 * @desc Mengecek apakah user yang sedang login valid (dengan JWT)
 * @route GET /api/auth/check-auth
 */
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(res, 200, true, "Check auth successful", { user });
  } catch (error) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};
