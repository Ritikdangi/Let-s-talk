# Let's Talk — Real-Time Chat App

A modern, responsive real-time chat application built with React (Vite), Node.js, Express, MongoDB and Socket.IO.

## Features

- Real-time messaging with Socket.IO
- Responsive UI for mobile and desktop (Tailwind CSS + DaisyUI)
- Authentication (JWT/cookie-based)
- Online/offline presence and typing indicators
- Conversation persistence (restores last open chat on refresh)
- Searchable user list and mobile-friendly drawer

## Tech Stack

- Frontend: React, Vite, Zustand, Tailwind CSS, DaisyUI, Axios, socket.io-client
- Backend: Node.js, Express, MongoDB (Mongoose), Socket.IO

## Quick start (Windows PowerShell)

Clone and install:

```powershell
git clone https://github.com/your-username/lets-talk.git
cd "C:\Users\ritik\Desktop\Let-s-talk"

# Install backend deps
cd backend
npm install

# Install frontend deps
cd ..\frontend
npm install
```

### Environment files (examples)

- Backend: `backend/.env`

```
MONGODB_URI=your_mongodb_connection_string
JWT_KEY=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

- Frontend: `frontend/.env`

```
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
JWT_KEY=fiergiergijeg
```

Notes:

- Do NOT wrap these values in quotes in `.env` files; Vite reads them literally.
- If you change `.env` for the frontend, restart the Vite dev server.

### Run servers

Open two PowerShell windows (or tabs). In the first (backend):

```powershell
cd "C:\Users\ritik\Desktop\Let-s-talk\backend"
npm run dev
```

In the second (frontend):

```powershell
cd "C:\Users\ritik\Desktop\Let-s-talk\frontend"
npm run dev
```

Frontend default URL: http://localhost:5173
Backend API / Socket: http://localhost:4000

## Usage

- Register or log in from the frontend.
- Open the sidebar (desktop left column or mobile burger). Search users and select a user to start a conversation.
- Messages are sent in real time. Typing indicators and online presence are shown using Socket.IO.

## Troubleshooting

- CORS / 401 errors
  - Ensure `CLIENT_URL` in backend `.env` equals your frontend origin (e.g., `http://localhost:5173`) and the backend CORS is configured with `credentials: true`.
  - When cookies are used cross-origin, set cookies with `sameSite=None; secure=true` for production HTTPS; in local dev use `secure: false`.

- Frontend returns HTML when calling the API
  - That means the `VITE_API_URL` points to the wrong server (often the frontend dev server). Confirm the `VITE_API_URL` value and restart Vite.

- Socket connection errors
  - Confirm backend Socket.IO server is running on the expected port and `VITE_SOCKET_URL` points to it. Check backend logs for incoming socket connections.

## Development notes

- Last-open conversation restores on page refresh (stored in `localStorage` as `lastConversation`). Logging out clears this key.
- Message state uses functional updates to avoid lost messages when multiple events arrive quickly.

## Deploy

- Deploy backend to a server or platform supporting Node.js (Heroku, Render, DigitalOcean, etc.).
- Deploy frontend to Vercel, Netlify, or similar. Update `CLIENT_URL`, `VITE_API_URL`, and `VITE_SOCKET_URL` to production URLs.

If you'd like, I can commit this README into the repo for you or add CI/startup scripts.
