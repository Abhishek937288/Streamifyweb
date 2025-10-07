import express from "express";
import dotenv from "dotenv/config";
import { connectDb } from "./lib/db.js";

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
  connectDb();
});
