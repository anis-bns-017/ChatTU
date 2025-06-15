import dotenv from "dotenv";
// Load env variables - MUST be at VERY TOP
dotenv.config({ path: "./.env" });

import express from "express";
import userRoute from "./routes/user.js";
import connectDB from "./utils/features.js";

// Extract variables
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

// Fail fast if no URI
if (!mongoURI) {
  console.error("❌ MongoDB URI is not defined in environment variables.");
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB(mongoURI).catch(err => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});

// Routes
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("✅ Welcome to the server!");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});