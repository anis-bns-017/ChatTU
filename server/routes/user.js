import express from "express";
import { login } from "../controllers/user.js";
import { newUser } from "../controllers/user.js";

const app = express.Router();

app.post("/login", login);
app.post("/new", newUser);

export default app;
