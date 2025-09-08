import { sendResponse } from "../utils/response.js";

export const validateSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return sendResponse(res, 400, false, "Validation failed", null, {
      detail: result.error.message,
    });
  }

  req.validatedData = result.data;
  next();
};
