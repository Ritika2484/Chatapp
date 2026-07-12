# ChatApp — Real-Time MERN Chat Application

A full-stack, real-time group chat application built with the **MERN** stack and **Socket.io**.

---

## Table of Contents
1. [Project Setup](#project-setup)
2. [Backend Installation](#backend-installation)
3. [Frontend Installation](#frontend-installation)
4. [MongoDB Setup](#mongodb-setup)
5. [Environment Variables](#environment-variables)
6. [How Socket.io Works](#how-socketio-works)
7. [Design Decisions](#design-decisions)
8. [Future Improvements](#future-improvements)

---

## Project Setup

```
chatapp/
├── backend/          ← Node.js + Express 4 + Socket.io API
└── client/           ← React (Vite) frontend
```

**Prerequisites**
- Node.js ≥ 18
- npm ≥ 9
- A MongoDB instance (Atlas free tier is fine)

---

## Backend Installation

```bash
cd chatapp/backend
npm install
cp .env.example .env   # then edit .env with your real values
npm run dev            # starts nodemon on port 5000
```

---

## Frontend Installation

```bash
cd chatapp/client
npm install
npm run dev            # starts Vite dev server on port 5173
```

---

## MongoDB Setup

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com/).
2. Add a database user and allow your IP (or `0.0.0.0/0` for dev).
3. Copy the **Connection String** (SRV format).
4. Paste it as `MONGO_URI` in `backend/.env`.

The `Message` collection is created automatically by Mongoose on first write.

---

## Environment Variables

### `backend/.env`

| Variable       | Description                        | Default                    |
|----------------|------------------------------------|----------------------------|
| `PORT`         | Port the Express server listens on | `5000`                     |
| `MONGO_URI`    | MongoDB connection string          | *(required)*               |
| `CLIENT_ORIGIN`| Allowed CORS origin                | `http://localhost:5173`    |

### `client/.env`

| Variable       | Description                        | Default                    |
|----------------|------------------------------------|----------------------------|
| `VITE_API_URL` | Base URL of the backend server     | `http://localhost:5000`    |

---

## How Socket.io Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Message Flow                               │
│                                                                     │
│  Client A          Backend (Express + Socket.io)       Client B    │
│  ───────           ─────────────────────────────       ────────    │
│                                                                     │
│  POST /api/messages  ──────────────────────────►                   │
│                        Save to MongoDB                              │
│                        io.emit("receive_message", savedMsg)         │
│                      ◄──────────────────────────  receive_message  │
│  ◄───── receive_message                                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

1. **User types a message** and submits the form.
2. The client calls `POST /api/messages` (REST).
3. The controller saves the document in MongoDB.
4. The controller calls `io.emit("receive_message", savedMessage)` — this broadcasts to **every** connected client (including the sender).
5. Every client's `ChatBox` has a `socket.on("receive_message", ...)` listener which appends the message to state.
6. **Deduplication**: before appending, the listener checks whether a message with the same `_id` already exists in state — preventing duplicates if the sender somehow received it twice.

### Circular Dependency Prevention

`server.js` initialises Socket.io and passes the instance to `socket.js` via `initSocket(io)`.  
`socket.js` stores it as a module-level variable.  
The controller retrieves it via `getIO()` from `socket.js` — it never imports `server.js`, so there is **no circular dependency**.

---

## Design Decisions

| Decision | Rationale |
|---|---|
| **REST for sending, Socket for receiving** | The POST endpoint is the single source of truth. Persisting before broadcasting guarantees the message is always saved. |
| **`io.emit` in the controller** | Keeps socket logic co-located with the business logic that triggers the event. |
| **Socket.io singleton (`getIO`)** | Avoids passing `io` through every function call or creating circular imports. |
| **`_id`-based deduplication** | MongoDB `ObjectId`s are unique; comparing them is cheap and reliable. |
| **localStorage for username** | Simple persistence that survives page refresh without a full auth system. |
| **CommonJS throughout the backend** | Consistent with Express 4 ecosystem conventions and avoids ESM/CJS interop issues. |
| **Vite + React for the client** | Fast HMR in development, lightweight production bundle. |

---

## Future Improvements

- **User authentication** — JWT-based login/signup with bcrypt hashed passwords.
- **Multiple chat rooms** — namespace or room-based Socket.io channels.
- **Message pagination** — infinite scroll with cursor-based pagination on `GET /api/messages`.
- **Message reactions** — emoji reactions stored as sub-documents.
- **Read receipts** — track which users have seen each message.
- **File/image sharing** — upload to S3 or Cloudinary, store URL in the message document.
- **Typing indicators** — emit a `typing` event and display "X is typing…" in the UI.
- **Push notifications** — Web Push API for messages received while the tab is in the background.
- **Rate limiting** — `express-rate-limit` on the POST endpoint to prevent spam.
- **Production deployment** — Dockerised services, nginx reverse proxy, PM2 process manager.
