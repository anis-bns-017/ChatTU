import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";
import connectDB from "./utils/features.js";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 8000;
const envMode = process.env.NODE_ENV?.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "asdfasdfas";

if (!mongoURI) {
  console.error("❌ MongoDB URI is not defined in environment variables.");
  process.exit(1);
}
const userSocketIDs = new Map();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB Connection
connectDB(mongoURI).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});

app.get("/", (req, res) => {
  res.send("✅ Welcome to the server!");
});

io.use((socket, next) => {
  
})

// Socket.IO Connection
io.on("connection", (socket) => {
  const user = {
    _id: "asdfa",
    name: "Anis",
  };

  userSocketIDs.set(user._id.toString(), socket.id);
  console.log(userSocketIDs);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messsageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const memberSocket = getSockets(members);
    io.to(memberSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messsageForRealTime,
    });

    io.to(memberSocket).emit(NEW_MESSAGE_ALERT, { chatId });
    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected!");
    userSocketIDs.delete(user._id.toString());
  });
});

// Routes
app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/admin", adminRoute);
app.use(errorMiddleware);

// Start Server
server.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port} in ${envMode} Mode`);
});

export { envMode, adminSecretKey, io, userSocketIDs };
