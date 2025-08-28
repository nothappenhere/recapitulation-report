import jwt from "jsonwebtoken";

import { body, validationResult } from "express-validator";
import { sendResponse } from "../utils/response.js";

// Fungsi untuk menangani error validasi
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

// Validasi registrasi
export const validateRegister = [
  body("fullName")
    .notEmpty()
    .withMessage("Field are required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters"),
  body("username")
    .notEmpty()
    .withMessage("Field are required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  // body("email")
  //   .notEmpty()
  //   .withMessage("Field are required")
  //   .isEmail()
  //   .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Field are required")
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Passwords must contain uppercase letters, numbers, symbols, and at least 8 characters."
    ),
  body("role")
    .notEmpty()
    .withMessage("Field are required")
    .isIn(["administrator", "educator", "user"])
    .withMessage("Invalid role"),

  handleValidationErrors,
];

// Validasi login
export const validateLogin = [
  body("username")
    .notEmpty()
    .withMessage("Field are required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("password")
    .notEmpty()
    .withMessage("Field are required")
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Passwords must contain uppercase letters, numbers, symbols, and at least 8 characters."
    ),

  handleValidationErrors,
];

// Validasi email exist
export const validateUsernameExist = [
  body("username")
    .notEmpty()
    .withMessage("Field are required")
    .withMessage("Invalid email format"),

  handleValidationErrors,
];

// Validasi reset password
export const validateResetPassword = [
  body("email")
    .notEmpty()
    .withMessage("Field are required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Field are required")
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Passwords must contain uppercase letters, numbers, symbols, and at least 8 characters."
    ),

  handleValidationErrors,
];

// Validasi token JWT
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return sendResponse(res, 401, false, "Unauthorized - no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return sendResponse(
        res,
        401,
        false,
        "Unauthorized - invalid or expired token"
      );
    }

    req.userId = decoded.userId;
    next();
  } catch (err) {
    return sendResponse(res, 500, false, "Internal server error", null, {
      detail: err.message,
    });
  }
};
