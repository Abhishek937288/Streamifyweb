import jwt from "jsonwebtoken";
const secretKey = process.env.secretKey;

const genAndSetToken = async (id, res) => {
  const token = jwt.sign({ id }, secretKey, { expiresIn: "15d" });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XSS attacks,
    sameSite: "strict", // prevent CSRF attacks
    secure: process.env.NODE_ENV === "production",
  });
};


export default genAndSetToken;