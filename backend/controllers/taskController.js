import Task from "../models/taskModel.js";
import asyncHandler from "express-async-handler";
import { logActivity } from "../utils/activityLogger.js";

//create a new task
const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(400).json({ message: "Please provide all required fields" });
    return;
  }
  const task = await Task.create({
    user: req.user._id,
    title,
    description,
  });
  if (task) {
    // LOG THE EVENT DYNAMICALLY
    await logActivity(
      "task_created",
      req.user.name,
      `Created task: ${task.title}`,
    );
    res.status(201).json(task);
  } else {
    res.status(400).json({ message: "Invalid task data" });
  }
});
//delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
  }
  res.status(200).json({ message: "Task deleted successfully" });
});
//update a task
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, completed } = req.body;
  const updatedtask = await Task.findByIdAndUpdate(
    req.params.id,
    { title, description, completed },
    { new: true, runValidators: true },
  );
  if (!updatedtask) {
    res.status(404).json({ message: "Task not found" });
  } else {
    // LOG THE EVENT
    await logActivity(
      "task_updated",
      req.user.name,
      `Updated task ID: ${req.params.id}`,
    );
    res.status(200).json(updatedtask);
  }
});
//get all tasks for a user
const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  if (!tasks) {
    res.status(404).json({ message: "No tasks found" });
  }
  res.status(200).json(tasks);
});
//get task by id
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
  }
  res.status(200).json(task);
});
export { createTask, deleteTask, updateTask, getAllTasks, getTaskById };
