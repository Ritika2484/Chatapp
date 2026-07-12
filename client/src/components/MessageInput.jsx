import React, { useState } from "react";
import { sendMessage } from "../services/api";

/**
 * MessageInput — text field + send button.
 *
 * Props:
 *  - username : string  (stored in localStorage, passed from App)
 */
const MessageInput = ({ username }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      // The REST POST saves the message and server emits it via Socket.io.
      // ChatBox listens on "receive_message" so we do NOT add it locally here
      // (that would duplicate it).
      await sendMessage(username, trimmed);
      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        id="message-text-input"
        type="text"
        className="message-input"
        placeholder="Type a message…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        disabled={sending}
      />
      <button
        id="send-button"
        type="submit"
        className="send-btn"
        disabled={!text.trim() || sending}
        aria-label="Send message"
      >
        {sending ? (
          <span className="btn-spinner" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="20"
            height="20"
          >
            <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        )}
      </button>
    </form>
  );
};

export default MessageInput;
