export type Category = "games" | "movies_tv" | "activities";
export type VoteValue = "like" | "dislike";
export type RoomPhase = "lobby" | "swiping" | "done";

export interface Item {
  id: string;
  text: string;
  category: Category;
  addedBy: string;       // socket id
  addedByName: string;   // user nickname
  createdAt: number;
}

export interface Vote {
  itemId: string;
  userId: string;
  value: VoteValue;
}

export interface Match {
  item: Item;
  matchedAt: number;
}

export interface User {
  id: string;
  name: string;
  isReady: boolean;
}

export interface Room {
  code: string;
  users: User[];
  items: Item[];
  votes: Vote[];
  matches: Match[];
  createdAt: number;
  phase: RoomPhase;
}

// ---- Client → Server payloads ----

export interface CreateRoomPayload {
  userName: string;
}

export interface JoinRoomPayload {
  roomCode: string;
  userName: string;
}

export interface AddItemPayload {
  roomCode: string;
  text: string;
  category: Category;
}

export interface RemoveItemPayload {
  roomCode: string;
  itemId: string;
}

export interface VotePayload {
  roomCode: string;
  itemId: string;
  value: VoteValue;
}

export interface StartSwipingPayload {
  roomCode: string;
}

// ---- Server → Client payloads ----

export interface RoomCreatedPayload {
  room: Room;
  userId: string;
}

export interface RoomJoinedPayload {
  room: Room;
  userId: string;
}

export interface RoomUpdatedPayload {
  room: Room;
}

export interface MatchFoundPayload {
  match: Match;
  allMatches: Match[];
}

export interface ErrorPayload {
  message: string;
}
