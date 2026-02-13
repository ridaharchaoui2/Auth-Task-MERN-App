import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // optional, only if you need it

// Load environment variables
dotenv.config();
connectDB();
// Server setup
const PORT = process.env.PORT || 8000;
const app = express();
const isVercel = process.env.VERCEL === "1";

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://auth-task-mern-app-frontend.vercel.app",
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow server-to-server/tools
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked: " + origin));
  },
  credentials: true,
};

// Handle CORS and preflight explicitly to satisfy Vercel/Express 5
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    if (origin) res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,X-Requested-With",
    );
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
  } else {
    return res.status(403).send("CORS blocked: " + origin);
  }
  next();
});

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
// Test route
app.get("/", (req, res) => {
  res.send("Route is working - Updated");
});

// Local dev server; on Vercel we export the handler instead
if (!isVercel && process.argv[1] === __filename) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
