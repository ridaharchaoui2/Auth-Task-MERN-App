import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  user: { type: String, default: "System" }, // Name of the user who did the action
  type: {
    type: String,
    enum: ["user_signup", "user_signin", "task_created", "task_updated"],
    required: true,
  },
  details: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
