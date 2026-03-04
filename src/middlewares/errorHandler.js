import createHttpError from "http-errors";

export const errorHandler = (err, req, res, _next) => {
  // Handle Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      status: 400,
      message: "Validation Error",
      data: err.details.map((d) => d.message),
    });
  }

  // Handle Mongoose cast errors (invalid ID)
  if (err.name === "CastError") {
    return res.status(400).json({
      status: 400,
      message: "Invalid ID format",
      data: err.message,
    });
  }

  const status = err.status || 500;
  const message = createHttpError.isHttpError(err)
    ? err.message
    : "Something went wrong";

  res.status(status).json({
    status,
    message,
    data: process.env.NODE_ENV === "development" ? err.stack : err.message,
  });
};
