import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";

const isAuthenticated = TryCatch(async (req, res, next) => {
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

export default isAuthenticated;
