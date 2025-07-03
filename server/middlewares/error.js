import { envMode } from "../app.js";

const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(",");
    err.message = `Duplicate field - ${error}`;
    err.statusCode = 400;
  }

  if (err.name === "CastError") {
    const errorPath = e.path;
    err.message = `Invalid Format of ${errorPath}`;
    err.statusCode = 400;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: envMode === "DEVELOPMENT" ? err : err.message,
  });
};

export const TryCatch = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
