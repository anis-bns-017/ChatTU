import mongoose from "mongoose";

const connectDB = (uri) => {
  return mongoose
    .connect(uri, {
      dbName: "Chattu", // Replace with your database name
    })
    .then((data) => {
      console.log(`Connected to DB: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
};

export default connectDB;
