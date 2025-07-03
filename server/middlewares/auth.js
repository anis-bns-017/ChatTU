import { adminSecretKey } from "../app.js";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies["token"];
  // console.log("Token:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not authenticated",
    });
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData.id;

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "You are not authenticated. Please log in.",
    });
  }

  next();
});

export const adminOnly = TryCatch(async (req, res, next) => {
  const token = req.cookies["chattu_admin_token"];
  // console.log("Token:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Only Admin can access this Route!",
    });
  }

  let decodedData;
  try {
    decodedData = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin token",
    });
  }

  // Check if the secret in the token matches the adminSecretKey
  if (!decodedData || decodedData.secretKey !== adminSecretKey) {
    return res.status(401).json({
      success: false,
      message: "Only Admin can access this Route!",
    });
  }

  req.admin = true;
  next();
});

export default isAuthenticated;
