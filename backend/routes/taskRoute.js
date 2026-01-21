import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createTask);
router.delete("/delete/:id", protect, deleteTask);
router.put("/update/:id", protect, updateTask);
router.get("/all", protect, getAllTasks);
router.get("/task/:id", protect, getTaskById);

export default router;
