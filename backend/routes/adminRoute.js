import express from "express";
import {
  deleteUser,
  getAllTasks,
  getAllUsers,
  getEngagementStats,
} from "../controllers/adminController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/users").get(protect, admin, getAllUsers);
router.route("/users/:id").delete(protect, admin, deleteUser);
router.route("/tasks").get(protect, admin, getAllTasks);
router.route("/engagement-stats").get(protect, admin, getEngagementStats);

export default router;
