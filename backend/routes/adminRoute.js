import express from "express";
import {
  deleteUser,
  getAllTasks,
  getAllUsers,
  getEngagementStats,
  deleteTaskAdmin,
  updateTaskAdmin,
  getSystemStats,
  clearActivityLogs,
} from "../controllers/adminController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/users").get(protect, admin, getAllUsers);
router.route("/users/:id").delete(protect, admin, deleteUser);
router.route("/tasks").get(protect, admin, getAllTasks);
router
  .route("/tasks/:id")
  .put(protect, admin, updateTaskAdmin)
  .delete(protect, admin, deleteTaskAdmin);
router.route("/engagement-stats").get(protect, admin, getEngagementStats);
router.route("/system-stats").get(protect, admin, getSystemStats);
router.route("/clear-logs").delete(protect, admin, clearActivityLogs);

export default router;
