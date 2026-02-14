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
    last7Days.setDate(last7Days.getDate() - 7);

    // Assuming you have an Activity model that logs 'user_signup', 'task_created', 'task_deleted'
    const stats = await Activity.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: "$createdAt" },
            type: "$type",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Transform the flat MongoDB results into a Recharts-friendly array
    const formattedData = dayNames.map((day, index) => {
      const dayEntries = stats.filter((s) => s._id.day === index + 1);
      return {
        name: day,
        signups:
          dayEntries.find((e) => e._id.type === "user_signup")?.count || 0,
        signins:
          dayEntries.find((e) => e._id.type === "user_signin")?.count || 0,
        created:
          dayEntries.find((e) => e._id.type === "task_created")?.count || 0,
        updated:
          dayEntries.find((e) => e._id.type === "task_updated")?.count || 0,
      };
    });

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export { getAllUsers, getAllTasks, deleteUser, getEngagementStats };
