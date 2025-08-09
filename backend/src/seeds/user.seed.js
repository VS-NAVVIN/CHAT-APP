import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/User.model.js";

config();

const seedUsers = [
  {
    email: "mohanbabu@gmail.com",
    fullname: "Mohan Babu",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "pinnisuraj@gmail.com",
    fullname: "Pinni Suraj",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "hari.shankar@gmail.com",
    fullname: "Hari Shankar",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "shrikrishana@gmail.com",
    fullname: "Shrikrishana",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
seedDatabase();