import express from "express";
import isAuthenticated from "../middlewares/auth.js";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMembers,
  renameGroup,
  sendAttachments,
} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/new-chat", newGroupChat);
app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmembers", addMembers);
app.put("/removemembers", removeMembers);
app.delete("/leave/:id", leaveGroup);

// send attachments
app.post("/message", attachmentsMulter, sendAttachments);

//get messasges

//get Chat details, remove, delete
app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default app;
