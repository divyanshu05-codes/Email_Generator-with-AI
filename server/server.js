require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const emailRoutes = require("./routes/email.routes");
const replyRoutes = require("./routes/reply.routes");
const historyRoutes = require("./routes/history.routes");
const replyHistoryRoutes = require("./routes/replyHistory.routes");

const app = express();

// Enable trust proxy for secure cookies behind Render reverse proxy
app.set("trust proxy", 1);

// MongoDB
connectDB();

// Middleware
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow all requests, dynamically reflecting the origin for credentials support
            callback(null, true);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"]
    })
);

app.use(express.json());
app.use(cookieParser());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/reply", replyRoutes);
app.use("/api/history", historyRoutes);
app.use(
    "/api/reply-history",
    replyHistoryRoutes
);


// Test route
app.get("/", (req, res) => {

    res.json({
        message:
            "MailMind AI Server is running."
    });

});


// Start server
const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `🚀Server running on port ${PORT}`
    );

});