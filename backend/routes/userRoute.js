import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router
  .route("/profile/:id")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post(
  "/upload-avatar",
  protect,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user._id);

      // ✅ SIMPLIFIED FOR CLOUDINARY
      // req.file.path is the full Cloudinary URL (e.g., https://res.cloudinary.com/...)
      user.avatar.url = req.file.path;

      await user.save();

      res.status(200).json({
        message: "Image uploaded successfully",
        url: user.avatar.url,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);
export default router;
