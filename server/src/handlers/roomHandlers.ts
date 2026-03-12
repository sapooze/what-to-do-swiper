import { Server, Socket } from "socket.io";
import { createRoom, joinRoom } from "../store/roomStore";
import { CreateRoomPayload, JoinRoomPayload } from "../types";

export function registerRoomHandlers(io: Server, socket: Socket): void {
  socket.on("create-room", (payload: CreateRoomPayload) => {
    const { userName } = payload;
    if (!userName?.trim()) {
      socket.emit("error", { message: "Name is required" });
      return;
    }

    const room = createRoom(userName.trim(), socket.id);
    socket.join(room.code);
    socket.emit("room-created", { room, userId: socket.id });
  });

  socket.on("join-room", (payload: JoinRoomPayload) => {
    const { roomCode, userName } = payload;
    if (!roomCode?.trim() || !userName?.trim()) {
      socket.emit("error", { message: "Room code and name are required" });
      return;
    }

    const room = joinRoom(roomCode.trim(), userName.trim(), socket.id);
    if (!room) {
      socket.emit("error", { message: "Room not found or full" });
      return;
    }

    socket.join(room.code);
    socket.emit("room-joined", { room, userId: socket.id });
    // Notify the other user
    socket.to(room.code).emit("room-updated", { room });
  });
}
