
const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";


    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        error: err,
    });
};

export const TryCatch = (fn) => async(req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;