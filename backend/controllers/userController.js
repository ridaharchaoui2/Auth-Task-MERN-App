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
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
    <h2 style="color: #18181b; margin-bottom: 16px;">Verify your email address</h2>
    <p style="color: #71717a; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
      Thanks for signing up! To get started with your Task Management App, please verify your email address by clicking the button below.
    </p>
    <a href="${verifyUrl}" 
       style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 12px 24px; font-weight: 500; font-size: 14px; text-decoration: none; border-radius: 6px;"
       clicktracking=off>
       Verify Email
    </a>
    <hr style="margin-top: 32px; border: 0; border-top: 1px solid #e4e4e7;" />
    <p style="color: #a1a1aa; font-size: 12px; margin-top: 16px;">
      If the button doesn't work, copy and paste this link into your browser: <br />
      <span style="color: #2563eb;">${verifyUrl}</span>
    </p>
    <p style="color: #a1a1aa; font-size: 12px;">
      This link will expire in 24 hours. If you did not create an account, no further action is required.
    </p>
  </div>
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
