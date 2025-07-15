import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    const data = await mongoose.connect(mongoURI, {
      dbName: "Chattu", // Your database name
    });
    console.log("✅ MongoDB connected successfully!");
    console.log(`🌍 Connected to database: ${data.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);

    // Provide helpful error messages
    if (err.message.includes("Authentication failed")) {
      console.error(
        "🔐 Check your username and password in the connection string"
      );
    } else if (err.message.includes("ENOTFOUND")) {
      console.error("🌐 Check your network connection and cluster URL");
    }

    process.exit(1);
  }
};

export const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: true, // Set to true if using HTTPS
    sameSite: "none", // Adjust based on your requirements
  };

  res.status(code).cookie("token", token, options).json({
    success: true,
    message,
    // user,
  });
};

export const emitEvent = (req, event, users, data) => {
  console.log(`Emitting event: ${event} to users: ${users.join(", ")}`);
  // Here you would typically use a library like Socket.IO to emit the event
  // For example: io.to(users).emit(event, data);
};

// ✅ Make sure Cloudinary is configured before calling this
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFilesToCloudinary = async (files = []) => {
  if (!files.length) throw new Error("No files provided for upload.");

  const uploadPromises = files.map((file) => {
    const base64Data = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Data,
        {
          resource_type: "auto",
          public_id: uuid(),
          folder: "uploads", // Optional: organize in a folder
          timeout: 60000, // ⏱ Optional: 60 sec timeout to avoid hanging
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            public_id: result.public_id,
            secureUrl: result.secure_url,
          });
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw new Error("Error uploading files to Cloudinary: " + error.message);
  }
};

export const deleteFilesFromCloudinary = async (public_ids) => {};
export default connectDB;
