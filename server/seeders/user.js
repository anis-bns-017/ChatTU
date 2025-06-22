import { faker } from "@faker-js/faker";
import { User } from "../models/user.js";

export const createUserChat = async (numUsers) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        password: "password123",
        avatar: {
          public_id: faker.system.fileName(),
          url: "D:CHATTUclientsrcassetsgirl.jpg",
        },
        bio: faker.lorem.sentence(10),
      });

      usersPromise.push(tempUser);
    }

    const users = await Promise.all(usersPromise);
    console.log(`${numUsers} users created successfully!`);
    return users;
  } catch (error) {
    console.error("Error creating UserChat:", error);
    process.exit(1);
  }
};


 