import express from "express";
import { login } from "../controllers/user.js";
import { newUser } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";

const app = express.Router();

app.post("/login", login);
app.post("/new-user",  singleAvatar, newUser);

export default app;
