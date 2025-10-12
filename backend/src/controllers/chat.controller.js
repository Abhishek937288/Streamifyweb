import { generateStreamToken } from "../lib/stream.js";

export const getStreamToken = (req, res) => {
  try {
    const token = generateStreamToken(req.user.id);
    return res.status(200).json({ token });
  } catch (err) {
    console.log("error while gettingstream token", err.message);
    return res.status(400).json({ message: "internal server error" });
  }
};
