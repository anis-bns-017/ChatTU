// avatar = [],
//   name,
//   _id,
//   lastMessage,
//   groupChat = false,
//   sameSender,
//   isOnline,
//   newMessageAlert,
//   index = 0,
//   handleDeleteChatOpen,

import girlPhoto from "../../assets/girl.jpg";
import earthPhoto from "../../assets/earth.jpg";
import beachPhoto from "../../assets/beach.jpg";
import castlePhoto from "../../assets/castle.jpg";
import cityPhoto from "../../assets/city.jpg";
import moonPhoto from "../../assets/moon.jpg";
import mountainPhoto from "../../assets/mountain.jpg";
import spacePhoto from "../../assets/space.jpg";
import { fileFormat } from "../../lib/features";

export const sampleChats = [
  {
    avatar: [girlPhoto],
    name: "Anisur Rahman",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: [girlPhoto],
    name: "Ariful Islam",
    _id: "2",
    groupChat: true,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: [girlPhoto],
    name: "Jakir Hossain",
    _id: "1",
  },
  {
    avatar: [girlPhoto],
    name: "Mohammad Yeasin",
    _id: "2",
  },
];

export const sampleNotifications = [
  {
    sender: {
      avatar: [girlPhoto],
      name: "Jakir Hossain",
    },
    _id: "1",
  },
  {
    sender: {
      avatar: [girlPhoto],
      name: "Mohammad Yeasin",
    },
    _id: "2",
  },
];

export const sampleMessage = [
  {
    attachments: [],
    content: "Hey there, i am using Chattu",
    _id: "asdfasdfa",
    sender: {
      _id: "user._id",
      name: "Chaman",
    },
    chat: "chatId",
    createdAt: "02-04-2025",
  },

  {
    attachments: [
      {
        public_id: "asdfas 2",
        url: earthPhoto,
      },
    ],
    content: "Hey there",
    _id: "asdfaaa",
    sender: {
      _id: "asdfasd",
      name: "Chaman 2",
    },
    chat: "chatId",
    createdAt: "03-22-2025",
  },

  {
    attachments: [],
    content: "kon baler jibon niye achi vai!! lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    _id: "asdfasdfa",
    sender: {
      _id: "user._id",
      name: "Chaman",
    },
    chat: "chatId",
    createdAt: "02-04-2025",
  },

  {
    attachments: [
       
    ],
    content: "Hey There, I wanna be a software engineer",
    _id: "asdfaaa",
    sender: {
      _id: "asdfasd",
      name: "Chaman 2",
    },
    chat: "chatId",
    createdAt: "03-22-2025",
  },
];

export const dashboardData = {
  users: [
    {
      name: "John Doe",
      avatar: girlPhoto,
      _id: "1",
      username: "john_doe",
      friends: 20,
      groups: 5,
    },
    {
      name: "Jane Smith",
      avatar: girlPhoto,
      _id: "2",
      username: "jane_smith",
      friends: 15,
      groups: 3,
    },
  ],
  chats: [
    {
      name: "Chat One",
      avatar: [girlPhoto],
      _id: "1",
      groupChat: false,
      totalMembers: 10,
      members: [
        {
          _id: "1",
          name: "John Doe",
          avatar: earthPhoto,
        },
        {
          _id: "2",
          name: "Jane Smith",
          avatar: beachPhoto,
        },
      ],
      totalMessages: 100,
      creator: {
        _id: "1",
        name: "John Doe",
        avatar: moonPhoto,
      },
    },
    {
      name: "Chat Two",
      avatar: [mountainPhoto],
      _id: "2",
      groupChat: true,
      totalMembers: 5,
      members: [
        {
          _id: "1",
          name: "John Doe",
          avatar: earthPhoto,
        },
        {
          _id: "2",
          name: "Jane Smith",
          avatar: cityPhoto,
        },
      ],
      totalMessages: 50,
      creator: {
        _id: "2",
        name: "Jane Smith",
        avatar: castlePhoto,
      },
    },
  ],

  messages: [
    {
      content: "Hello, how are you?",
      attachments: [],
      _id: "msg1",
      sender: {
        _id: "1",
        name: "John Doe",
        avatar: moonPhoto,
      },
      chat: "1",
      groupChat: false,
      createdAt: "2025-01-01T12:00:00Z",
      updatedAt: "2025-01-01T12:00:00Z",
    },
    {
      content: "I'm good, thanks!",
      attachments: [
        {
          public_id: "msg2_attachment",
          url: castlePhoto,
        },
      ],
      _id: "msg2",
      sender: {
        _id: "2",
        name: "Jane Smith",
        avatar: castlePhoto,
      },
      chat: "1",
      groupChat: true,
      createdAt: "2025-01-01T12:00:00Z",
      updatedAt: "2025-01-01T12:00:00Z",
    },
  ],
};
