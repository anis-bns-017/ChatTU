import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { emitEvent } from "../utils/features.js";
 
const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2) {
    return res.status(400).json({
      success: false,
      message: "At least 2 members are required to create a group chat.",
    });
  }

  const allMembers = [...members, req.user];
  const chat = await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to the group chat: ${name}`);
  emitEvent(
    req,
    REFETCH_CHATS,
    members,
    `You created a new group chat: ${name}`
  );

  return res.status(201).json({
    success: true,
    message: `Group chat "${name}" created successfully!`,
  });
});

export { newGroupChat };
