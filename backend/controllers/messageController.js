const Message = require("../models/Message");
const { getIO } = require("../socket");

// GET /api/messages  — fetch full chat history (newest last)
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("getMessages error:", err.message);
    res.status(500).json({ error: "Server error while fetching messages." });
  }
};

// POST /api/messages  — save a message and broadcast via Socket.io
const createMessage = async (req, res) => {
  const { username, text } = req.body;

  if (!username || !text) {
    return res
      .status(400)
      .json({ error: "username and text are required fields." });
  }

  try {
    const message = await Message.create({ username, text });

    // Broadcast to every connected client
    const io = getIO();
    io.emit("receive_message", message);

    res.status(201).json(message);
  } catch (err) {
    console.error("createMessage error:", err.message);
    res.status(500).json({ error: "Server error while saving message." });
  }
};

module.exports = { getMessages, createMessage };
