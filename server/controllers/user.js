import { compare, setRandomFallback } from "bcryptjs";
import { User } from "../models/user.js";
import { sendToken } from "../utils/features.js";

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

const login = async (req, res, next) => {
  const { username, password } = req.body;
  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();
  console.log("Trimmed Username:", trimmedUsername);
  console.log("Trimmed Password:", trimmedPassword);

  if (!trimmedUsername || !trimmedPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide username and password",
    });
  }

  const user = await User.findOne({ username: trimmedUsername }).select(
    "+password"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isPasswordMatched = await compare(trimmedPassword, user.password);

  if (!isPasswordMatched) {
    return res.status(401).json({
      // Added `return` here
      success: false,
      message: "Invalid username or password",
    });
  }

  sendToken(res, user, 200, `Welcome back, ${user.name}!`);
};

const getProfile = async (req, res) => {
  return await res.status(200).json({
    success: true,
    user: req.user,
  });
};
export { login, newUser, getProfile };
