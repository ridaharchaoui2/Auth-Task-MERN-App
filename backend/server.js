import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
// Load environment variables
dotenv.config();
connectDB();
// Server setup
const PORT = process.env.PORT || 8000;
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Routes
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
// Test route
app.get("/", (req, res) => {
  res.send("Route is working");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
