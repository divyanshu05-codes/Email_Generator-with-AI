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


// MongoDB
connectDB();


// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
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