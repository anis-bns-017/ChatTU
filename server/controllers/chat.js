import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";
import { ErrorHandler, SuccessResponse } from "../utils/utility.js";

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;
  console.log("i am : ", req.user);

  if (members.length < 2) {
    return ErrorHandler(res, "A group chat must have at least 2 members", 400);
  }

  const allMembers = [...members, req.user];
  const chat = await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  console.log("New group chat created:", chat);

  emitEvent(req, ALERT, allMembers, `Welcome to the group chat: ${name}`);
  emitEvent(
    req,
    REFETCH_CHATS,
    members,
    `You created a new group chat: ${name}`
  );

  return new SuccessResponse(
    res,
    `Group chat "${name}" created successfully!`,
    chat,
    201
  );
});

const getMyChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
  }).populate("members", "_id name avatar");

  console.log("My chats:", chats);

  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    console.log("members:", members);

    const otherMember = members.find((member) => {
      console.log("Current member:", member);
      if (!member || !member._id) return false; // guard clause
      return member._id.toString() !== req.user.toString();
    });

    console.log("Other member:", otherMember);

    if (!otherMember) {
      throw new ErrorHandler(404, "No other members found in the chat");
    }

    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      name: groupChat
        ? name || members.map((member) => member.name).join(", ")
        : otherMember.name,
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
    };
  });

  return res.status(200).json({
    success: true,
    message: "Fetched all my chats successfully!",
    chats: transformedChats,
  });
});

const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({
    success: true,
    groups,
  });
});

const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  if (!members || members.length < 1) {
    return ErrorHandler(res, "Please add Members!", 400);
  }

  const chat = await Chat.findById(chatId);

  if (!chat) return ErrorHandler(res, "Chat not Found!", 404);

  if (!chat.groupChat)
    return ErrorHandler(res, "This is not a Group Chat!", 404);

  if (chat.creator.toString() !== req.user.toString())
    return ErrorHandler(res, "Only the group creator can add members", 403);

  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

  const allNewMembers = await Promise.all(allNewMembersPromise);

  chat.members.push(...allNewMembers.map((i) => i?._id));

  if (chat.members.length > 100) {
    return ErrorHandler(res, "Group cannot have more than 100 members", 400);
  }

  await chat.save();

  const allUsersName = allNewMembers.map((i) => i.name).join(", ");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} have been added to the Group`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Members added Successfully",
  });
});

const removeMembers = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;
  const [chat, userThatwillbeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId),
  ]);

  if (!chat) return ErrorHandler(res, "Chat not Found!", 404);

  if (!chat.groupChat)
    return ErrorHandler(res, "This is not a group chat!", 400);

  if (chat.members.length <= 3)
    return ErrorHandler(res, "Group must have at least 3 members!", 400);

  if (!Array.isArray(chat.members)) chat.members = [];

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userThatwillbeRemoved.name} has been removed from the group`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Member removed Successfully",
  });
});

const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  // Find the chat
  const chat = await Chat.findById(chatId);
  if (!chat) return ErrorHandler(res, "Chat not found", 404);

  // Must be a group chat
  if (!chat.groupChat)
    return ErrorHandler(res, "This is not a group chat!", 400);

  // Convert user ID to string for comparison
  const userId = req.user.toString();

  // Remove the user from the members list
  const remainingMembers = chat.members.filter(
    (member) => member.toString() !== userId
  );

  // Must have at least 3 members after removal
  if (remainingMembers.length < 3) {
    return ErrorHandler(res, "Group must have at least 3 members", 400);
  }

  // If the user leaving is the creator, assign a new random creator
  if (chat.creator.toString() === userId) {
    const randomIndex = Math.floor(Math.random() * remainingMembers.length);
    chat.creator = remainingMembers[randomIndex];
  }

  // Update the chat members
  chat.members = remainingMembers;

  // Save chat and get user name in parallel
  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);

  const userName = user?.name || "A user";

  // Notify all remaining members
  emitEvent(req, ALERT, chat.members, `User ${userName} has left the group.`);

  return res.status(200).json({
    success: true,
    message: "You have left the group successfully.",
  });
});

const sendAttachments = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);

  console.log("Hey there: ", req.user);

  if (!chat) return ErrorHandler(res, "Chat not found", 404);

  if (!me) return ErrorHandler(res, "User not found", 404);

  const files = req.files || [];

  if (files.length < 1) return ErrorHandler(res, "No files attached", 400);

  // You should replace this placeholder with actual uploaded file URLs or metadata
  const attachments = [];

  const messageForDB = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: me._id,
      name: me.name,
    },
  };

  const message = await Message.create(messageForDB);

  emitEvent(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  return res.status(200).json({
    success: true,
    message,
  });
});

const getChatDetails = TryCatch(async (req, res) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();

    if (!chat) return ErrorHandler(res, "Chat not found", 404);

    // Properly map members to extract _id, name, and avatar.url
    chat.members = chat.members.map((member) => ({
      _id: member._id,
      name: member.name,
      avatar: member.avatar?.url,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return ErrorHandler(res, "Chat not found", 403);
    return res.status(200).json({
      success: true,
      chat,
    });
  }
});

const renameGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat.groupChat) {
    return ErrorHandler(res, "This is not a group chat", 400);
  }

  if (chat.creator.toString() != req.user.toString()) {
    return ErrorHandler(res, "You are not allower to rename the group", 403);
  }

  chat.name = name;
  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Group renamed successfully",
  });
});

const deleteChat = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);
  if (!chat) return ErrorHandler(res, "Chat not found", 404);

  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
    return ErrorHandler(res, "You are not allowed to delete the group", 403);
  }

  if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
    return ErrorHandler(res, "You are not allowed to delete the chat", 403);
  }

  // here we have to delete all messages as well as attachments or files from cloudinary

  const messageWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];
  messageWithAttachments.forEach(({ attachments }) => {
    attachments.forEach(({ public_id }) => {
      public_ids.push(public_id);
    });
  });

  await Promise.all([
    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    message: true,
    message: "Chat deteted successfully",
  });
});

export {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  leaveGroup,
  removeMembers,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
};
