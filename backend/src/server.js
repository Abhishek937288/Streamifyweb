import express from "express";
import dotenv from "dotenv/config";
import { connectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();
const port = process.env.PORT;

const frontendUrl = process.env.FRONTEND_URL;

app.use(cors({
origin :frontendUrl,
credentials: true
}))

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
  connectDb();
});
