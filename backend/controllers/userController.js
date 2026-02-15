import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { logActivity } from "../utils/activityLogger.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// 1. Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (await User.findOne({ email })) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  // Generate a random verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
    verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    isVerified: false, // Force false initially
  });

  if (user) {
    // Construct the verification URL (Points to your Frontend)
    // Example: http://localhost:5173/verify-email/23847238947...
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const message = `
      <h1>Email Verification</h1>
      <p>Please verify your email to continue.</p>
      <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Task App - Verify your email",
        message,
      });

      res.status(201).json({
        message:
          "Registration successful! Please check your email to verify account.",
      });
    } catch (error) {
      // If email fails, we might want to delete the user so they can try again
      await User.findByIdAndDelete(user._id);
      res
        .status(500)
        .json({ message: "Email could not be sent. Please try again." });
    }
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});
//  VERIFY EMAIL
const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.params.token;

  // Find user with matching token and ensure it hasn't expired ($gt = greater than now)
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({ message: "Invalid or expired token" });
    return;
  }

  // Verify user and clear token
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  // OPTIONAL: Log them in immediately, or just send success message
  generateToken(res, user._id);

  res
    .status(200)
    .json({ message: "Email verified successfully! You can now login." });
});

// 3. LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // 👇 CHECK IF VERIFIED 👇
    if (!user.isVerified) {
      res
        .status(401)
        .json({ message: "Please verify your email before logging in." });
      return;
    }

    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
    });
    await logActivity("user_signin", user.name, "User logged in");
  } else {
    res.status(401).json({ message: "Invalid email or password" });
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
  verifyEmail,
};
