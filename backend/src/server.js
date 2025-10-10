import express from "express";
import dotenv from "dotenv/config";
import { connectDb } from "./lib/db.js";
import authroutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT;
app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authroutes);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
  connectDb();
});
