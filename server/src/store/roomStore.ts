import { v4 as uuidv4 } from "uuid";
import { Room, User, Item, Vote, Match, Category, VoteValue } from "../types";
import { generateRoomCode } from "../utils/codeGenerator";

const rooms = new Map<string, Room>();
// Map from socketId → roomCode for quick disconnect lookup
const socketToRoom = new Map<string, string>();

export function createRoom(userName: string, socketId: string): Room {
  let code: string;
  do {
    code = generateRoomCode();
  } while (rooms.has(code));

  const user: User = { id: socketId, name: userName, isReady: false };
  const room: Room = {
    code,
    users: [user],
    items: [],
    votes: [],
    matches: [],
    createdAt: Date.now(),
    phase: "lobby",
  };

  rooms.set(code, room);
  socketToRoom.set(socketId, code);
  return room;
}

export function joinRoom(
  roomCode: string,
  userName: string,
  socketId: string
): Room | null {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) return null;

  // Allow rejoin if socket was previously in this room (reconnect)
  const existingUser = room.users.find((u) => u.name === userName);
  if (existingUser) {
    existingUser.id = socketId;
    socketToRoom.set(socketId, roomCode.toUpperCase());
    return room;
  }

  if (room.users.length >= 2) return null;

  const user: User = { id: socketId, name: userName, isReady: false };
  room.users.push(user);
  socketToRoom.set(socketId, roomCode.toUpperCase());
  return room;
}

export function getRoom(roomCode: string): Room | undefined {
  return rooms.get(roomCode.toUpperCase());
}

export function addItem(
  roomCode: string,
  text: string,
  category: Category,
  userId: string,
  userName: string
): Room | null {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) return null;

  const item: Item = {
    id: uuidv4(),
    text: text.trim(),
    category,
    addedBy: userId,
    addedByName: userName,
    createdAt: Date.now(),
  };
  room.items.push(item);
  return room;
}

export function removeItem(
  roomCode: string,
  itemId: string,
  userId: string
): Room | null {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) return null;

  const idx = room.items.findIndex(
    (item) => item.id === itemId && item.addedBy === userId
  );
  if (idx === -1) return null;

  room.items.splice(idx, 1);
  // Remove any votes for this item
  room.votes = room.votes.filter((v) => v.itemId !== itemId);
  return room;
}

export function setUserReady(
  roomCode: string,
  userId: string
): { room: Room; allReady: boolean } | null {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) return null;

  const user = room.users.find((u) => u.id === userId);
  if (user) user.isReady = true;

  const allReady = room.users.length === 2 && room.users.every((u) => u.isReady);
  if (allReady) {
    room.phase = "swiping";
    // Reset ready flags
    room.users.forEach((u) => (u.isReady = false));
  }

  return { room, allReady };
}

export function recordVote(
  roomCode: string,
  itemId: string,
  userId: string,
  value: VoteValue
): { room: Room; newMatch: Match | null } | null {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) return null;

  // Ignore duplicate votes
  const existing = room.votes.find(
    (v) => v.itemId === itemId && v.userId === userId
  );
  if (existing) return { room, newMatch: null };

  const vote: Vote = { itemId, userId, value };
  room.votes.push(vote);

  // Check for match
  let newMatch: Match | null = null;
  if (value === "like") {
    const otherUser = room.users.find((u) => u.id !== userId);
    if (otherUser) {
      const otherVote = room.votes.find(
        (v) =>
          v.itemId === itemId &&
          v.userId === otherUser.id &&
          v.value === "like"
      );
      if (otherVote) {
        const item = room.items.find((i) => i.id === itemId);
        if (item) {
          newMatch = { item, matchedAt: Date.now() };
          room.matches.push(newMatch);
        }
      }
    }
  }

  return { room, newMatch };
}

export function removeUserBySocket(socketId: string): {
  room: Room;
  code: string;
} | null {
  const code = socketToRoom.get(socketId);
  if (!code) return null;

  const room = rooms.get(code);
  if (!room) return null;

  socketToRoom.delete(socketId);
  room.users = room.users.filter((u) => u.id !== socketId);

  // Clean up empty rooms
  if (room.users.length === 0) {
    rooms.delete(code);
    return null;
  }

  return { room, code };
}

// Purge rooms older than 24 hours
setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const [code, room] of rooms.entries()) {
    if (room.createdAt < cutoff) {
      for (const user of room.users) {
        socketToRoom.delete(user.id);
      }
      rooms.delete(code);
    }
  }
}, 60 * 60 * 1000);
