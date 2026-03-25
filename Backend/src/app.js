import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
// CORS Configuration
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://192.168.1.8:5173", "http://192.168.1.8:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: false
};

app.use(cors(corsOptions));

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

// DEBUG: Test endpoint to verify request body parsing
app.post("/debug/test-body", (req, res) => {
    console.log("DEBUG TEST - Full Request Info:");
    console.log("  Headers:", req.headers);
    console.log("  Body:", req.body);
    res.json({
        received: req.body,
        headers: req.headers
    });
});

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

export default app;
