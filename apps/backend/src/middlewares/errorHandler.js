const errorHandler = (err, _, res) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ msg: message });
};

export default errorHandler;
