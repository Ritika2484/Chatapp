import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
});

/**
 * Fetch all messages from the server (chat history).
 * @returns {Promise<Array>} Array of message objects
 */
export const fetchMessages = async () => {
  const response = await api.get("/api/messages");
  return response.data;
};

/**
 * Post a new message to the server.
 * @param {string} username
 * @param {string} text
 * @returns {Promise<Object>} Saved message object
 */
export const sendMessage = async (username, text) => {
  const response = await api.post("/api/messages", { username, text });
  return response.data;
};
