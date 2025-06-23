import { compare, setRandomFallback } from "bcryptjs";
import { User } from "../models/user.js";
import { emitEvent, sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";

const newUser = async (req, res) => {
  const { name, username, password, bio } = req.body;

  try {
    const user = await User.create({
      name,
      username,
      password,
      avatar: {
        public_id: "sample_public_id",
        url: "https://example.com/avatar.jpg",
      },
      bio,
    });

    sendToken(res, user, 201, "User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;
  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  if (!trimmedUsername || !trimmedPassword) {
    return new ErrorHandler(400, "Username and password are required");
  }

  const user = await User.findOne({ username: trimmedUsername }).select(
    "+password"
  );

  if (!user) {
    return new ErrorHandler(401, "Invalid username or password");
  }

  const isPasswordMatched = await compare(trimmedPassword, user.password);

  if (!isPasswordMatched) {
    return new ErrorHandler(401, "Invalid username or password");
  }

  sendToken(res, user, 200, `Welcome back, ${user.name}!`);
});

const getMyProfile = async (req, res) => {
  await User.findById(req.user)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      req.user = user;
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching user profile",
        error: error.message,
      });
    });
  return await res.status(200).json({
    success: true,
    user: req.user,
  });
};

const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: "none", // Adjust based on your requirements
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const searchUser = TryCatch(async (req, res) => {
  const { name } = req.query;

  const myChats = await Chat.find({
    groupChat: false,
    members: req.user,
  });

  //Extracting All users from my chats means friends or people i have chated with
  const allUsersFromMyChats = myChats.map((chat) => chat.members).flat();

  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: allUsersFromMyChats },
    name: { $regex: name, $options: "i" },
  });

  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avata: avatar.url,
  }));

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Name query parameter is required",
    });
  }

  return res.status(200).json({
    success: true,
    users,
  });
});

const sendFriendRequest = TryCatch(async (req, res) => {
  const { userId } = req.body;

  console.log(userId);
  if (!userId) {
    return ErrorHandler(res, "Receiver ID (userId) is required", 400);
  }

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) {
    return ErrorHandler(res, "Request already sent", 400);
  }

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json({
    success: true,
    message: "Friend Request Sent",
  });
});

const acceptFriendRequest = TryCatch(async (req, res) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) {
    throw new ErrorHandler(404, "Friend request not found");
  }

  if (request.receiver._id.toString() !== req.user.toString()) {
    throw new ErrorHandler(
      401,
      "You are not authorized to accept this request"
    );
  }

  if (accept === true) {
    // Add each user to the other's friends list
    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
      Chat.create({
        members,
        name: `${request.sender.name}-${request.receiver.name}`,
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: `Friend request Accepted`,
      senderId: request.sender._id,
    });
  } else {
    await request.deleteOne();
    return res.status(200).json({
      success: true,
      message: `Friend request rejected`,
    });
  }
});

const getAllNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

const getMyFriends = TryCatch(async (req, res) => {
  const chatId = req.query.chatId;

  const chats = await Chat.find({
    members: req.user,
    groupChat: false,
  }).populate("members", "name avatar");

  const friends = chats.map((chat) => {
    const otheruser = chat.members.find(
      (member) => member._id.toString() !== req.user.toString()
    );

    return {
      _id: otheruser._id,
      name: otheruser.name,
      avatar: otheruser.avatar.url,
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId);
    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      availableFriends: availableFriends,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends ,
    });
  }
});

export {
  login,
  getMyFriends,
  newUser,
  getMyProfile,
  logout,
  searchUser,
  acceptFriendRequest,
  sendFriendRequest,
  getAllNotifications,
};
