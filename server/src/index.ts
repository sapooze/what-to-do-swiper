import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { registerRoomHandlers } from "./handlers/roomHandlers";
import { registerItemHandlers } from "./handlers/itemHandlers";
import { registerVoteHandlers } from "./handlers/voteHandlers";
import { removeUserBySocket } from "./store/roomStore";

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  registerRoomHandlers(io, socket);
  registerItemHandlers(io, socket);
  registerVoteHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log(`[socket] disconnected: ${socket.id}`);
    const result = removeUserBySocket(socket.id);
    if (result) {
      socket.to(result.code).emit("partner-disconnected");
      io.to(result.code).emit("room-updated", { room: result.room });
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
