import Activity from "../models/activityModel.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

//get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: "No users found" });
  }
});
const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({});
  if (tasks) {
    res.status(200).json(tasks);
  } else {
    res.status(404).json({ message: "No tasks found" });
  }
});
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) {
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
const getEngagementStats = async (req, res) => {
  try {
    const last7Days = new Date();
    // Set to 7 days ago, starting at 00:00:00 to catch all of today
    last7Days.setDate(last7Days.getDate() - 6);
    last7Days.setHours(0, 0, 0, 0);

    const stats = await Activity.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            // Group by day of year or exact date string to keep them unique
            day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$type",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const formattedData = [];

    // Generate the last 7 days ending with TODAY
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateString = date.toISOString().split("T")[0];
      const dayName = dayNames[date.getDay()];

      const dayEntries = stats.filter((s) => s._id.day === dateString);

      formattedData.push({
        name: dayName,
        signups:
          dayEntries.find((e) => e._id.type === "user_signup")?.count || 0,
        signins:
          dayEntries.find((e) => e._id.type === "user_signin")?.count || 0,
        created:
          dayEntries.find((e) => e._id.type === "task_created")?.count || 0,
        updated:
          dayEntries.find((e) => e._id.type === "task_updated")?.count || 0,
      });
    }

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Admin delete any task
const deleteTaskAdmin = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(200).json({ message: "Task deleted successfully" });
});

// Admin update any task
const updateTaskAdmin = asyncHandler(async (req, res) => {
  const updateFields = {};
  if (req.body.title !== undefined) updateFields.title = req.body.title;
  if (req.body.description !== undefined)
    updateFields.description = req.body.description;
  if (req.body.completed !== undefined)
    updateFields.completed = req.body.completed;
  if (req.body.priority !== undefined)
    updateFields.priority = req.body.priority;
  if (req.body.dueDate !== undefined) updateFields.dueDate = req.body.dueDate;

  const task = await Task.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(200).json(task);
});

// Admin get system stats for settings page
const getSystemStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const verifiedUsers = await User.countDocuments({ isVerified: true });
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ completed: true });
  const totalActivities = await Activity.countDocuments();

  res.status(200).json({
    totalUsers,
    verifiedUsers,
    totalTasks,
    completedTasks,
    totalActivities,
  });
});

// Admin clear all activity logs
const clearActivityLogs = asyncHandler(async (req, res) => {
  await Activity.deleteMany({});
  res.status(200).json({ message: "All activity logs cleared" });
});

export {
  getAllUsers,
  getAllTasks,
  deleteUser,
  getEngagementStats,
  deleteTaskAdmin,
  updateTaskAdmin,
  getSystemStats,
  clearActivityLogs,
};
