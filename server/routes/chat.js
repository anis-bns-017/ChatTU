import express from "express";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMembers,
  renameGroup,
  sendAttachments,
} from "../controllers/chat.js";
import {
  addMembersValidator,
  chatIdValidator,
  newGroupValidator,
  removeMembersValidator,
  sendAttachmentsValidator,
  validateHandler,
} from "../lib/validators.js";
import isAuthenticated from "../middlewares/auth.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/new-chat", newGroupValidator(), validateHandler, newGroupChat);
app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmembers", addMembersValidator(), validateHandler, addMembers);
app.put(
  "/removemembers",
  removeMembersValidator(),
  validateHandler,
  removeMembers
);
app.delete("/leave/:id", chatIdValidator(), validateHandler, leaveGroup);

// send attachments
app.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  validateHandler,
  sendAttachments
);

//get messasges
app.get("/message/:id", chatIdValidator(), validateHandler, getMessages);

//get Chat details, remove, delete
app
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(chatIdValidator(), validateHandler, renameGroup)
  .delete(chatIdValidator(), validateHandler, deleteChat);

export default app;
