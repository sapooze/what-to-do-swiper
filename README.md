# What To Do Swiper

A real-time collaborative decision-making app that helps two people agree on what to do together. Think Tinder, but for activities — both users swipe through a shared list of ideas, and when you both like the same thing, it's a match!

## Features

- **Room-based sessions** — Create or join a room with a unique code (e.g. `BRAVE-WOLF-42`), no sign-up required
- **Add your own ideas** — Both users contribute items in three categories: Games 🎮, Movies & TV 🎬, and Activities 🏃
- **Swipe to vote** — Swipe right to like, left to pass on each item
- **Real-time matches** — When both users like the same item, a match is instantly shown to both
- **Matches page** — Review all agreed-upon activities in one place
- **No database** — Fully ephemeral; rooms expire after 24 hours

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite (dev server & build)
- Tailwind CSS (styling)
- Zustand (state management)
- Socket.IO Client (real-time sync)
- React Router DOM (client-side routing)

**Backend**
- Node.js + Express
- Socket.IO (WebSocket server)
- TypeScript
- In-memory room store (no database)

## Project Structure

```
what-to-do-swiper/
├── client/                  # React frontend
│   └── src/
│       ├── pages/           # HomePage, RoomPage, LobbyPage, SwiperPage, MatchesPage
│       ├── components/      # lobby/, swiper/, match/ UI components
│       ├── hooks/           # useSocket, useSwipe
│       ├── store/           # Zustand store (useRoomStore)
│       ├── socket/          # Socket.IO client instance
│       └── types/           # Shared TypeScript types
└── server/                  # Express + Socket.IO backend
    └── src/
        ├── handlers/        # roomHandlers, itemHandlers, voteHandlers
        ├── store/           # In-memory roomStore
        └── utils/           # codeGenerator (room codes)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm run install:all
```

### Running in Development

Start the backend (runs on `http://localhost:3001`):

```bash
npm run dev:server
```

In a separate terminal, start the frontend (runs on `http://localhost:5173`):

```bash
npm run dev:client
```

Open `http://localhost:5173` in two browser windows to test the full experience.

### Environment Variables

**Server** (optional):

| Variable        | Default                      | Description                  |
|-----------------|------------------------------|------------------------------|
| `PORT`          | `3001`                       | HTTP server port             |
| `CLIENT_ORIGIN` | `http://localhost:5173`      | Allowed CORS origin          |

**Client** (optional):

| Variable          | Default                    | Description                      |
|-------------------|----------------------------|----------------------------------|
| `VITE_SERVER_URL` | `http://localhost:3001`    | Backend Socket.IO server URL     |

## How It Works

1. **Create or join a room** — One person creates a room and shares the code with their partner
2. **Add ideas in the lobby** — Each person adds items they'd like to do (games, movies, activities)
3. **Start swiping** — Once both users are ready, swipe right to like or left to pass on each item
4. **Get matched** — When both people like the same item, a match notification pops up in real-time
5. **Review matches** — Visit the Matches page to see everything you both agreed on

## Building for Production

Build the client:

```bash
cd client && npm run build
```

Build the server:

```bash
cd server && npm run build
```

Run the production server:

```bash
cd server && npm start
```
