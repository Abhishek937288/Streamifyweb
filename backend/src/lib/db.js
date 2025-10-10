import mongoose from "mongoose";

const url = process.env.MONGO_URI;

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(url);
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (err) {
    console.log("errr while connectiong mongoDB", err);
    process.exit(1); // failure one
  }
};
