import dotenv from "dotenv";
// Load env variables - MUST be at VERY TOP
dotenv.config({ path: "./.env" });

import express from "express";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";
import connectDB from "./utils/features.js";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import {
  createGroupChats,
  createMessagesInChat,
  createSingleChats,
} from "./seeders/chat.js";

// Extract variables
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 8000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";

const adminSecretKey = process.env.ADMIN_SECRET_KEY || "asdfasdfas";

// Fail fast if no URI
if (!mongoURI) {
  console.error("❌ MongoDB URI is not defined in environment variables.");
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
connectDB(mongoURI).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});

// createSingleChats(10);
// createGroupChats(10);
// createMessagesInChat("6856d6aee3dceb50fcc86092", 50);

// createUserChat(10);

app.get("/", (req, res) => {
  res.send("✅ Welcome to the server!");
});

app.use(errorMiddleware);

// Routes
app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/admin", adminRoute);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port} in ${envMode} Mode`);
});

export { envMode, adminSecretKey };
