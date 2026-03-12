import { Server, Socket } from "socket.io";
import { setUserReady, recordVote } from "../store/roomStore";
import { VotePayload, StartSwipingPayload } from "../types";

export function registerVoteHandlers(io: Server, socket: Socket): void {
  socket.on("start-swiping", (payload: StartSwipingPayload) => {
    const { roomCode } = payload;
    const result = setUserReady(roomCode, socket.id);
    if (!result) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    io.to(result.room.code).emit("room-updated", { room: result.room });
  });

  socket.on("vote", (payload: VotePayload) => {
    const { roomCode, itemId, value } = payload;
    const result = recordVote(roomCode, itemId, socket.id, value);
    if (!result) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    const { room, newMatch } = result;
    io.to(room.code).emit("room-updated", { room });

    if (newMatch) {
      io.to(room.code).emit("match-found", {
        match: newMatch,
        allMatches: room.matches,
      });
    }
  });
}
