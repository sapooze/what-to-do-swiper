// Mirrored from server/src/types/index.ts
export type Category = "games" | "movies_tv" | "activities";
export type VoteValue = "like" | "dislike";
export type RoomPhase = "lobby" | "swiping" | "done";

export interface Item {
  id: string;
  text: string;
  category: Category;
  addedBy: string;
  addedByName: string;
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

export const CATEGORY_LABELS: Record<Category, string> = {
  games: "Games",
  movies_tv: "Movies & TV",
  activities: "Activities",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  games: "🎮",
  movies_tv: "🎬",
  activities: "🏃",
};
