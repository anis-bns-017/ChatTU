import express from "express";
import {
  adminLogin,
  adminLogout,
  allChats,
  allMessages,
  allUsers,
  getAdminData,
  getDashboardStats,
} from "../controllers/admin.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAdminData);

router.post("/verify", adminLoginValidator(), validateHandler, adminLogin);

router.get("/logout", adminLogout);

// Only admin can access this route
router.use(adminOnly);

router.get("/users", allUsers);

router.get("/chats", allChats);

router.get("/messages", allMessages);

router.get("/stats", getDashboardStats);

export default router;
