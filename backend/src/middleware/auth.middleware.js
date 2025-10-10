import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "unauthorised no token provided" });
    }

    const decoded = jwt.verify(token, process.env.secretKey);

    if (!decoded) {
      return res.status(401).json({ message: "invalid token " });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: " user not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log("Error in protectRoute middleware", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
