import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      default: Date.now, // Defaults to today if not specified
    },
  },
  {
    timestamps: true,
  },
);
//  filtering by date is fast
taskSchema.index({ dueDate: 1 });
const Task = mongoose.model("Task", taskSchema);

export default Task;
