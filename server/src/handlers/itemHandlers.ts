import { Server, Socket } from "socket.io";
import { addItem, removeItem, getRoom } from "../store/roomStore";
import { AddItemPayload, RemoveItemPayload } from "../types";

export function registerItemHandlers(io: Server, socket: Socket): void {
  socket.on("add-item", (payload: AddItemPayload) => {
    const { roomCode, text, category } = payload;
    if (!text?.trim()) {
      socket.emit("error", { message: "Item text is required" });
      return;
    }

    const room = getRoom(roomCode);
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    const user = room.users.find((u) => u.id === socket.id);
    if (!user) {
      socket.emit("error", { message: "You are not in this room" });
      return;
    }

    const updatedRoom = addItem(roomCode, text, category, socket.id, user.name);
    if (!updatedRoom) return;

    io.to(updatedRoom.code).emit("room-updated", { room: updatedRoom });
  });

  socket.on("remove-item", (payload: RemoveItemPayload) => {
    const { roomCode, itemId } = payload;

    const updatedRoom = removeItem(roomCode, itemId, socket.id);
    if (!updatedRoom) {
      socket.emit("error", { message: "Cannot remove item" });
      return;
    }

    io.to(updatedRoom.code).emit("room-updated", { room: updatedRoom });
  });
}
