import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";

import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";
import connectDB from "./utils/features.js";
import errorMiddleware from "./middlewares/error.js";

import { Message } from "./models/message.js";
import { getSockets } from "./lib/helper.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";

// --- Constants ---
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 8000;
const envMode = process.env.NODE_ENV?.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "asdfasdfas";
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

// --- DB Check ---
if (!mongoURI) {
  console.error("❌ MongoDB URI is not defined in environment variables.");
  process.exit(1);
}

// --- Server Setup ---
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: frontendURL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketIDs = new Map();

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: frontendURL,
    credentials: true,
  })
);

// --- Cloudinary Config ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// --- Connect to DB ---
connectDB(mongoURI).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});

// --- Routes ---
app.get("/", (req, res) => {
  res.send("✅ Welcome to the server!");
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);
app.use(errorMiddleware);

// --- Socket.IO Auth Middleware Placeholder ---
io.use((socket, next) => {
  // Add token/auth logic if needed
  next();
});

// --- Socket.IO Connection ---
io.on("connection", (socket) => {
  const user = {
    _id: "asdfa", // Replace with real user data later
    name: "Anis",
  };

  userSocketIDs.set(user._id.toString(), socket.id);
  console.log("✅ User connected:", user.name, socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const realTimeMsg = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const dbMessage = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const memberSocketIds = members
      .map((id) => userSocketIDs.get(id))
      .filter(Boolean); // remove undefined

    memberSocketIds.forEach((socketId) => {
      io.to(socketId).emit(NEW_MESSAGE, {
        chatId,
        message: realTimeMsg,
      });
      io.to(socketId).emit(NEW_MESSAGE_ALERT, { chatId });
    });

    try {
      await Message.create(dbMessage);
    } catch (err) {
      console.error("❌ Error saving message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("⚠️ User disconnected:", user._id);
    userSocketIDs.delete(user._id.toString());
  });
});

// --- Start Server ---
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port} in ${envMode} mode`);
});

// --- Export for others to use ---
export { envMode, adminSecretKey, io, userSocketIDs };
