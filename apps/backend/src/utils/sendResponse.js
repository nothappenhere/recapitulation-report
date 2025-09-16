import dayjs from "dayjs";

export const sendResponse = (
  res,
  statusCode,
  success,
  message,
  data = null,
  errors = null
) => {
  return res.status(statusCode).json({
    success,
    statusCode,
    message,
    data,
    errors,
    path: res.req.originalUrl,
    timestamp: dayjs().format("DD-MM-YYYY, HH:mm:ss"),
  });
};

export const sendError = (res, err) => {
  sendResponse(res, 500, false, "Internal server error", null, {
    detail: err.message,
  });
};
