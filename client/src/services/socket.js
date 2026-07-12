import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * A single shared Socket.io client instance.
 * Importing this module always returns the same socket object.
 */
const socket = io(SERVER_URL, {
  transports: ["websocket", "polling"],
  autoConnect: true,
});

export default socket;
