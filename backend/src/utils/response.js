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
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (res, err) => {
  sendResponse(res, 500, false, "Internal server error", null, {
    detail: err.message,
  });
};
