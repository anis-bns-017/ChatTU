import { compare, setRandomFallback } from "bcryptjs";
import { User } from "../models/user.js";
import { sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";

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

  const myChats = await User.find({
    groupChat: false,
    members: req.user,
  });

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Name query parameter is required",
    });
  }

  return res.status(200).json({
    success: true,
    myChats,
  });
});

export { login, newUser, getMyProfile, logout, searchUser };
