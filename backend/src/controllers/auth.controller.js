import User from "../models/User.js";
import genAndSetToken from "../utils/genSetToken.js";
import { upsertStreamUser } from "../lib/stream.js";

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

  try {
    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic,
    });
    console.log(`Stream user created for ${newUser.fullName}`);
  } catch (err) {
    console.log("error while upstream user", err);
  }

  genAndSetToken(newUser._id, res);

  res.status(201).json({ success: true, user: newUser });
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

export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "all fields required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );
    if (!updatedUser)
      return res.status(400).json({ message: "user not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream user updated after onboarding for ${updatedUser.fullName}`
      );
    } catch (err) {
      console.log(
        "Error updating Stream user during onboarding:",
        streamError.message
      );
    }
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.log("Error updating Stream user during onboarding:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
