const express = require("express");
const router = express.Router();
const { getMessages, createMessage } = require("../controllers/messageController");

// GET /api/messages
router.get("/", getMessages);

// POST /api/messages
router.post("/", createMessage);

module.exports = router;
