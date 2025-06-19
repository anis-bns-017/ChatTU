export const ErrorHandler = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export class SuccessResponse {
  constructor(res, message, data = null, statusCode = 200) {
    const response = {
      success: true,
      message,
    };
    
    if (data) response.data = data;
    
    return res.status(statusCode).json(response);
  }
}