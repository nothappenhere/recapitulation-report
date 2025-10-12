import { sendResponse } from "../utils/sendResponse.js";

const notFound = (_, res) => {
  const statusCode = 404;
  const message = "Not found endpoint!";
  return sendResponse(res, statusCode, false, "Internal server error", null, {
    detail: message,
  });
};

export default notFound;
