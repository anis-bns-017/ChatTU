import { User } from "../models/user.js";
import { faker } from "@faker-js/faker";

const createUserChat = async (numUsers) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        password: "password123", // Use a default password for seeding
        avatar: {
          public_id: faker.system.fileName(),
          url: "D:\CHATTU\client\src\assets\girl.jpg",
        },
        bio: faker.lorem.sentence(10),
      });

      usersPromise.push(tempUser);
    }

    await Promise.all(usersPromise);
    console.log(`${numUsers} users created successfully!`);
    return usersPromise;
    process.exit(1);
  } catch (error) {
    console.error("Error creating UserChat:", error);
    process.exit(1);
  }
};

export { createUserChat };
