import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";
import { adminSecretKey } from "../app.js";

export const adminLogin = TryCatch(async (req, res) => {
  const { secretKey } = req.body;

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched) return ErrorHandler(res, "Invalid Admin Key", 401);

  const token = jwt.sign(secretKey, process.env.JWT_SECRET);

  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: true, // Set to true if using HTTPS
    sameSite: "none", // Adjust based on your requirements
  };

  return res
    .status(200)
    .cookie("chattu_admin_token", token, {
      ...options,
      maxAge: 1000 * 60 * 15,
    })
    .json({
      success: true,
      message: "Authenticated Successfully, Welcome BOSS!!!",
    });
});

export const adminLogout = TryCatch(async (req, res) => {
  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: true, // Set to true if using HTTPS
    sameSite: "none", // Adjust based on your requirements
  };

  return res
    .status(200)
    .cookie("chattu_admin_token", "", {
      ...options,
      maxAge: 0,
    })
    .json({
      success: true,
      message: "Admin Logged out Successfully!",
    });
});

export const getAdminData = TryCatch(async (req, res) => {
  return res.status(200).json({
    admin: true,
  });
});

export const allUsers = TryCatch(async (req, res) => {
  const users = await User.find({});

  const transformedUsers = await Promise.all(
    users.map(async ({ name, username, avatar, _id }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ groupChat: true, members: _id }),
        Chat.countDocuments({ groupChat: false, members: _id }),
      ]);
      return {
        name,
        username,
        avatar: avatar.url,
        _id,
        groups,
        friends,
      };
    })
  );

  return res.status(200).json({
    status: "success",
    users: transformedUsers,
  });
});

export const allChats = TryCatch(async (_unused, res) => {
  const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transoformedChats = await Promise.all(
    chats.map(async (chat) => {
      const { members, _id, groupChat, name, creator } = chat;
      const totalMessages = await Message.countDocuments({ chat: _id });
      return {
        _id,
        groupChat,
        name,
        avatar: members.slice(0, 3).map((member) => member.avatar.url),
        members: members.map(({ _id, name, avatar }) => {
          return {
            _id,
            name,
            avatar: avatar.url,
          };
        }),
        creator: {
          name: creator?.name || "none",
          avatar: creator?.avatar?.url || null,
        },
        totalMembers: members.length,
        totalMessages,
      };
    })
  );

  return res.status(200).json({
    status: "success",
    chats: transoformedChats,
  });
});

export const allMessages = TryCatch(async (req, res) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

  const transformedMessages = messages.map(
    ({ content, attachments, _id, sender, createdAt, chat }) => ({
      _id,
      attachments,
      content,
      createdAt,
      chat: chat._id,
      groupChat: chat.groupChat,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    })
  );
  return res.status(200).json({
    status: "success",
    messages,
  });
});

export const getDashboardStats = TryCatch(async (req, res) => {
  const [groupCount, usersCount, messageCount, totalChatsCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      User.countDocuments(),
      Message.countDocuments(),
      Chat.countDocuments(),
    ]);

  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const last7DaysMessages = await Message.find({
    createdAt: {
      $gte: last7Days,
      $lte: today,
    },
  }).select("createdAt");

  console.log("okay: ", last7DaysMessages);

  const messages = new Array(7).fill(0);
  const dayInMilliseconds = 1000 * 60 * 60 * 24;

  last7DaysMessages.forEach((message) => {
    const indexApprox =
      (today.getTime() - message.createdAt.getTime()) / dayInMilliseconds;

    const index = Math.floor(indexApprox);
    console.log(index);
    messages[6 - index]++;
  });

  const stats = {
    groupCount,
    usersCount,
    messageCount,
    totalChatsCount,
  };
  return res.status(200).json({
    status: "success",
    stats,
    messages,
  });
});
