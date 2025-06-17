import mongoose from "mongoose";
import jwt from "jsonwebtoken";

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

export default connectDB;
