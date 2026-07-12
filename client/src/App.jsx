import React, { useState } from "react";
import ChatBox from "./components/ChatBox";
import "./App.css";

const USERNAME_KEY = "chatapp_username";

function App() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem(USERNAME_KEY) || "";
  });
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const isLoggedIn = Boolean(username);

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError("Please enter a username.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    }
    localStorage.setItem(USERNAME_KEY, trimmed);
    setUsername(trimmed);
  };

  const handleLogout = () => {
    localStorage.removeItem(USERNAME_KEY);
    setUsername("");
    setInputValue("");
    setError("");
  };

  // Helper elements to render decorative background elements
  const renderDecorations = () => (
    <div className="decorations-container" aria-hidden="true">
      {/* Cloud 1 */}
      <svg className="clay-dec clay-dec-cloud1" viewBox="0 0 100 60" fill="#FFFFFF">
        <path d="M20 40a20 20 0 0118-20 24 24 0 0144 0 20 20 0 0118 20 20 20 0 01-20 20H40A20 20 0 0120 40z" opacity="0.9" />
      </svg>
      {/* Cloud 2 */}
      <svg className="clay-dec clay-dec-cloud2" viewBox="0 0 100 60" fill="#FFFFFF">
        <path d="M20 40a20 20 0 0118-20 24 24 0 0144 0 20 20 0 0118 20 20 20 0 01-20 20H40A20 20 0 0120 40z" opacity="0.9" />
      </svg>
      {/* Heart */}
      <svg className="clay-dec clay-dec-heart" viewBox="0 0 24 24" fill="#FF8BA7">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      {/* Potted Plant */}
      <svg className="clay-dec clay-dec-plant" viewBox="0 0 64 80" fill="none">
        {/* Pot */}
        <path d="M22 50h20l-3 20H25l-3-20z" fill="#FFC6FF" />
        <path d="M20 46h24v4H20v-4z" fill="#FFB7B2" />
        {/* Leaves */}
        <path d="M32 12c0 0 4 10 0 20-4-10 0-20 0-20z" fill="#B9FBC0" />
        <path d="M32 20c-5-5-15-5-12 12 5 0 12-5 12-12z" fill="#98F5E1" />
        <path d="M32 22c5-5 15-5 12 12-5 0-12-5-12-12z" fill="#98F5E1" />
        <path d="M32 28c-8 0-16 6-10 16 6 0 10-8 10-16z" fill="#8EECF5" />
        <path d="M32 28c8 0 16 6 10 16-6 0-10-8-10-16z" fill="#8EECF5" />
      </svg>
      {/* Sparkle */}
      <svg className="clay-dec clay-dec-sparkle" viewBox="0 0 24 24" fill="#FFDE47">
        <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9z" />
      </svg>
    </div>
  );

  if (isLoggedIn) {
    return (
      <>
        {renderDecorations()}
        <ChatBox username={username} onLogout={handleLogout} />
      </>
    );
  }

  return (
    <div className="login-screen">
      {renderDecorations()}
      
      <div className="login-card-wrapper">
        {/* Winking Hoodie Avatar */}
        <img 
          src="/clay_character.png" 
          alt="Friendly 3D Avatar Greeting You" 
          className="login-character"
        />

        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Enter a username to join the conversation</p>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-wrapper">
              <div className="input-badge">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <input
                id="username-input"
                type="text"
                className="login-input"
                placeholder="Username"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError("");
                }}
                autoFocus
                autoComplete="off"
                maxLength={30}
              />
            </div>
            {error && <p className="login-error">{error}</p>}
            
            <button id="join-button" type="submit" className="login-btn">
              Join Chat
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default App;
