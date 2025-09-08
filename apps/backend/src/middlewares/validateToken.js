import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/response.js";

export const validateToken = (req, res, next) => {
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
