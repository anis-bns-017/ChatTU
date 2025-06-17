import express from "express";
import { getMyProfile, login, logout, searchUser } from "../controllers/user.js";
import { newUser } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/auth.js";

const app = express.Router();

app.post("/login", login);
app.post("/new-user", singleAvatar, newUser);

app.use(isAuthenticated);

// After here use must be logged in to access the routes.
app.get("/me", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);

export default app;
