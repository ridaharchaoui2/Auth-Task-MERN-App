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
// 1. Define allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://auth-task-mern-app-frontend.vercel.app",
];

// 2. Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// 3. APPLY CORS BEFORE ANYTHING ELSE
app.use(cors(corsOptions));

// 4. Explicitly handle Preflight for all routes
app.options("*", cors(corsOptions));
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
