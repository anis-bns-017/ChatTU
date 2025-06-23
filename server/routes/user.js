import express from "express";
import {
  acceptFriendRequest,
  getAllNotifications,
  getMyFriends,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
} from "../controllers/user.js";
import {
  acceptRequestValidator,
  getAllNotificationsValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from "../lib/validators.js";
import isAuthenticated from "../middlewares/auth.js";
import { singleAvatar } from "../middlewares/multer.js";

const app = express.Router();

app.post("/login", loginValidator(), validateHandler, login);
app.post(
  "/new-user",
  singleAvatar,
  registerValidator(),
  validateHandler,
  newUser
);

app.use(isAuthenticated);

// After here use must be logged in to access the routes.
app.get("/me", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);
app.put(
  "/sendrequest",
  sendRequestValidator(),
  validateHandler,
  sendFriendRequest
);

app.put(
  "/acceptrequest",
  acceptRequestValidator(),
  validateHandler,
  acceptFriendRequest
);

app.get("/notifications", getAllNotifications);

app.get("/notifications", getAllNotifications);

app.get("/friends", getMyFriends);
export default app;
