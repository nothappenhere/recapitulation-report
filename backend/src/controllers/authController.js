import bcrypt from "bcrypt";

import { User } from "../models/User.js";
import { sendResponse } from "../utils/response.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

/**
 * @desc Get all users with pagination (limit & page dari query)
 * @route GET /api/auth/
 */
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default page 1
    const limit = parseInt(req.query.limit) || 10; // default 10 items per page
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    return sendResponse(res, 200, true, `Successful get users page ${page}`, {
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * @desc Get detail user berdasarkan ID
 * @route GET /api/auth/user/:id
 */
export const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const userWithId = await User.findById(id);
    if (!userWithId) {
      return sendResponse(res, 404, false, `User with id ${id} not found`);
    }

    return sendResponse(res, 200, true, `User with id ${id} found`, {
      user: { ...userWithId._doc, password: undefined },
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * @desc Update data user berdasarkan ID (nama, email, username, role, password)
 * @route PUT /api/auth/user/:id
 */
export const updateUserById = async (req, res) => {
  const id = req.params.id;
  const { fullName, username, email, password, role } = req.body;

  try {
    const userAlreadyExists = await User.findById(id);
    if (!userAlreadyExists) {
      return sendResponse(res, 404, false, "User not found");
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return sendResponse(res, 200, true, "User updated successfully", {
      user: updatedUser,
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * @desc Delete user berdasarkan ID
 * @route DELETE /api/auth/user/:id
 */
export const deleteUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const userAlreadyExists = await User.findById(id);
    if (!userAlreadyExists) {
      return sendResponse(res, 404, false, "User not found");
    }

    await User.findByIdAndDelete(id);
    return sendResponse(res, 200, true, "User deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * @desc Register / signup user baru (role: administrator | educator | user)
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
 * @desc Verifikasi apakah email sudah terdaftar di database
 * @route POST /api/auth/verify-email
 */
export const verifyUsername = async (req, res) => {
  const { username } = req.body;

  try {
    const userAlreadyExists = await User.findOne({ username });
    if (!userAlreadyExists) {
      return sendResponse(res, 404, false, "Unregistered user", {
        exists: false,
      });
    }

    return sendResponse(res, 200, true, "Registered user", { exists: true });
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};

/**
 * @desc Reset password user berdasarkan email
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

/**
 * @desc Mendapatkan daftar user yang aktif login dalam 1 jam terakhir
 * @route GET /api/auth/active-users
 */
export const activeUsers = async (req, res) => {
  try {
    const oneHoursAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
    const users = await User.find({ lastLogin: { $gte: oneHoursAgo } });

    return sendResponse(
      res,
      200,
      true,
      "Successfully acquired an active user 1 hours ago",
      { users }
    );
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};
