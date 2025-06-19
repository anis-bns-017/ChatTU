import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { emitEvent } from "../utils/features.js";
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

export { newGroupChat, getMyChats, getMyGroups, addMembers };
