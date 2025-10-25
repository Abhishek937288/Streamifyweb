import express from "express";
import dotenv from "dotenv/config";
import { connectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();
const port = process.env.PORT;

const frontendUrl = process.env.FRONTEND_URL;

const __dirname = path.resolve();
// to get path of curr working dir

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  //This tells Express to serve all the static files (HTML, CSS, JS, images, etc.)
  //from the folder frontend/dist
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    //If someone visits any route (like /dashboard, /chat/123, etc.) that Express doesn’t already know —
//send them the index.html file.
  });
}

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
  connectDb();
});
