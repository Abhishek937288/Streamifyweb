import User from "../models/User.js";
import genAndSetToken from "../utils/genSetToken.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ data: null, success: false, message: "All fields required" });
  }
  if (password.length <= 6) {
    return res.status(400).json({
      dataL: null,
      success: false,
      message: "Password must be atleat 6 characters",
    });
  }
  const emailRegax = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegax.test(email)) {
    return res
      .status(400)
      .json({ data: null, success: false, message: "Enter valid email" });
  }
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    return res
      .status(400)
      .json({ data: null, success: false, message: "Mail already taken" });
  }
  const randomNo = Math.floor(Math.random() * 100) + 1; // no from 1 to 100
  const randomAvatar = `https://avatar.iran.liara.run/public/${randomNo}.png`;

  const newUser = await User.create({
    email,
    fullName,
    password,
    profilePic: randomAvatar,
  });

  genAndSetToken(newUser._id, res);

  return res.status(200).json({
    data: newUser,
    success: true,
    message: "New user Created succesfully",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ data: null, success: false, message: "All fields required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ data: null, success: false, message: "no user found" });
  }
  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch) {
    return res.status(400).json({
      data: null,
      success: false,
      message: "Incorrect mail or password",
    });
  }

  genAndSetToken(user._id, res);
  return res
    .status(200)
    .json({ data: user, success: true, message: "User login successfully" });
};

export const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, maxAge: 0 });
  return res
    .status(200)
    .json({ data: null, success: true, message: "User Logout successfully" });
};
