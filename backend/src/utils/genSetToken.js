import jwt from "jsonwebtoken";
const secretKey = process.env.secretKey;

const genAndSetToken = async (id, res) => {
  const token = jwt.sign({ id }, secretKey, { expiresIn: "15d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
};

export default genAndSetToken;
