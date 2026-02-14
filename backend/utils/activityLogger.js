import Activity from "../models/activityModel.js";

export const logActivity = async (type, user = "System", details = "") => {
  try {
    await Activity.create({ type, user, details });
  } catch (err) {
    console.error("Activity Log Error:", err);
  }
};
