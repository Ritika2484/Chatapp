import React from "react";

/**
 * Renders a single chat message bubble.
 * Own messages (from the current user) appear on the right side.
 *
 * Props:
 *  - message  : { _id, username, text, createdAt }
 *  - currentUser : string  (the logged-in username)
 */
const Message = ({ message, currentUser }) => {
  const isOwn = message.username === currentUser;

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`message-wrapper ${isOwn ? "own" : "other"}`}>
      {!isOwn && <span className="message-username">{message.username}</span>}
      <div className="message-bubble">
        <p className="message-text">{message.text}</p>
        <span className="message-time">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
};

export default Message;
