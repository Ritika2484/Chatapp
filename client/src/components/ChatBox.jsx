import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { fetchMessages } from "../services/api";
import socket from "../services/socket";

/**
 * ChatBox — the main chat panel.
 *
 * Props:
 *  - username : string
 *  - onLogout : () => void
 */
const ChatBox = ({ username, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(socket.connected);
  const bottomRef = useRef(null);

  // ── Load history on mount ────────────────────────────────────────────────
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await fetchMessages();
        setMessages(history);
      } catch (err) {
        console.error("Failed to load message history:", err);
      }
    };

    loadHistory();
  }, []);

  // ── Socket.io listeners ──────────────────────────────────────────────────
  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    const handleReceive = (newMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === newMessage._id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("receive_message", handleReceive);
    };
  }, []);

  // ── Auto-scroll to bottom ────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbox">
      {/* Header */}
      <header className="chatbox-header">
        <div className="header-left">
          <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          <div>
            <h1 className="header-title">ChatApp</h1>
            <p className="header-user">Logged in as <strong>{username}</strong></p>
          </div>
        </div>
        <div className="header-right">
          <span className={`status-badge ${connected ? "online" : "offline"}`}>
            {connected ? "Online" : "Offline"}
          </span>
          <button id="logout-button" className="logout-btn" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 && (
          <p className="empty-state">No messages yet. Say hello! 👋</p>
        )}
        {messages.map((msg) => (
          <Message key={msg._id} message={msg} currentUser={username} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <footer className="chatbox-footer">
        <MessageInput username={username} />
      </footer>
    </div>
  );
};

export default ChatBox;
