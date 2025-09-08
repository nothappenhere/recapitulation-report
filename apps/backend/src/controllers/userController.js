import { User } from "../models/User.js";
import { sendResponse } from "../utils/response.js";

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
