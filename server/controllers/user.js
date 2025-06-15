import { User } from "../modals/user.js";

// create a new user and save it to the database and save in cookie
const login = async (req, res) => {
  await User.create({
    name: "John Doe",
    username: "johndoe",
    password: "password123",
    avatar: {
      public_id: "sample_public_id",
      url: "https://example.com/avatar.jpg",
    },
  });
  res.status(201).send("User logged in successfully!");
};

const newUser = (req, res) => {
  res.send("New User Created!");
};

export { login, newUser };
