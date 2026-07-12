require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const messageRoutes = require("./routes/messageRoutes");
const { initSocket } = require("./socket");

// ── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ── Express app ─────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

// ── REST routes ──────────────────────────────────────────────────────────────
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Chat server is running ✔");
});

// ── Socket.io ────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});