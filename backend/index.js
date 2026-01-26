import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
connectDB();
// Server setup
const PORT = process.env.PORT || 8000;
const app = express();

// Middlewares
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: [allowedOrigin], // Allow the domain from env
    methods: ["POST", "GET"],
    credentials: true,
  }),
);
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
if (process.argv[1] === __filename) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
