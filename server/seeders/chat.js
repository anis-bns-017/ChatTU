import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { faker, simpleFaker } from "@faker-js/faker";

export const createSingleChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");

    const chatsPromise = [];
    for (let i = 0; i < numChats; i++) {
      // Get two different random users
      const user1 = users[Math.floor(Math.random() * users.length)];
      let user2 = users[Math.floor(Math.random() * users.length)];

      // Ensure we have two different users
      while (user2._id.toString() === user1._id.toString()) {
        user2 = users[Math.floor(Math.random() * users.length)];
      }

      chatsPromise.push(
        Chat.create({
          name: faker.lorem.words(2),
          members: [user1, user2], // Fixed typo: 'memebers' -> 'members'
        })
      );
    }

    await Promise.all(chatsPromise);
    console.log("Chats created Successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const createGroupChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");

    const chatsPromise = [];

    for (let i = 0; i < numChats; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
      const members = new Set(); // Using Set to avoid duplicates

      while (members.size < numMembers) {
        const randomIndex = Math.floor(Math.random() * users.length);
        members.add(users[randomIndex]);
      }

      const membersArray = Array.from(members);

      const chat = await Chat.create({
        groupChat: true,
        name: faker.lorem.words(1),
        members: membersArray,
        creator: membersArray[0],
      });

      chatsPromise.push(chat);
    }

    await Promise.all(chatsPromise);
    console.log("Group chats created successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const createMessages = async (numMessages) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id"); // Fixed variable name from 'chat' to 'chats'

    const messagesPromise = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messagesPromise.push(
        Message.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromise); // Moved inside try block
    console.log("Messages created Successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const createMessagesInChat = async (chatId, numMessages) => {
  try {
    const users = await User.find().select("_id"); // Added await
    const messagesPromise = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      messagesPromise.push(
        // Fixed typo: 'created' -> 'push'
        Message.create({
          chat: chatId,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromise);
    console.log("Messages created Successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
