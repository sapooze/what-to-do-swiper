# What To Do? 🤔

A real-time couples/friends activity decider. Both people add things they'd like to do, then swipe on each other's suggestions — when you both swipe right on the same item, it's a match!

## Features

- **Create or join a room** — share a room code with your partner, no account needed
- **Add items** — suggest games, movies/TV shows, or activities
- **Swipe together** — swipe right to like, left to skip; matches appear in real-time
- **Dark mode** — toggle between light and dark themes, preference is saved automatically
- **Export list** — save your current item list as a short code you can copy and share
- **Import list** — paste a previously exported code to instantly restore all items into a new room

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand
- **Backend:** Node.js, Socket.IO
- **Real-time:** WebSockets via Socket.IO

## Getting Started

### Prerequisites

- Node.js 18+

### Install & Run

```bash
# Install all dependencies (client + server)
npm run install:all

# Start both client and server
npm start
```

The client runs on `http://localhost:5173` and the server on `http://localhost:3001`.

### Run separately

```bash
# Server only
cd server && npm run dev

# Client only
cd client && npm run dev
```

## How to Play

1. Open the app and enter your nickname
2. **Create a room** or **join** one with a room code
3. Add items to your list (games, movies/TV, activities)
4. Share the room code with your partner so they can join
5. Both players click **Start Swiping** when ready
6. Swipe right ❤️ to like, left ✕ to skip
7. When you both like the same thing — it's a match! 🎉
8. Check **Matches** to see everything you agreed on

## Export / Import

To save your list for next time:
1. In the lobby, click **Export** next to the items header
2. Copy the generated code
3. In a future room, click **Import** and paste the code — all items are added instantly

Both users' items are included in the export code.

## Dark Mode

Click the 🌙 / ☀️ button in the top corner of any page to toggle dark mode. Your preference is saved in the browser.
