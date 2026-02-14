import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { logActivity } from "../utils/activityLogger.js";

//Login user & get token
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
    });
    // LOG THE EVENT
    await logActivity("user_signin", user.name, "User logged in");
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});
//Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    res.status(400).json({ message: "User already exists" });
    return;
  }
  const user = await User.create({ name, email, password });
  if (user) {
    // generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
    // LOG THE EVENT
    await logActivity("user_signup", user.name, "User registered");
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});
//logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id || req.user._id;
  const user = await User.findById(userId);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      avatar: updatedUser.avatar,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Upload failed" });
    }

    const user = await User.findById(req.user._id);

    // Multer-storage-cloudinary provides the secure URL automatically
    user.avatar.url = req.file.path;
    await user.save();

    res.status(200).json({
      message: "Avatar updated in the cloud!",
      url: user.avatar.url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
};
