import { create } from "zustand";
import { Room, Match, VoteValue } from "../types";

interface RoomStore {
  room: Room | null;
  userId: string | null;
  myVotes: Record<string, VoteValue>;
  pendingMatch: Match | null;
  partnerDisconnected: boolean;
  connectionError: string | null;

  setRoom: (room: Room) => void;
  setUserId: (id: string) => void;
  recordMyVote: (itemId: string, value: VoteValue) => void;
  setPendingMatch: (match: Match | null) => void;
  setPartnerDisconnected: (val: boolean) => void;
  setConnectionError: (msg: string | null) => void;
  reset: () => void;
}

const initialState = {
  room: null,
  userId: null,
  myVotes: {} as Record<string, VoteValue>,
  pendingMatch: null,
  partnerDisconnected: false,
  connectionError: null,
};

export const useRoomStore = create<RoomStore>((set) => ({
  ...initialState,

  setRoom: (room) => set({ room }),
  setUserId: (userId) => set({ userId }),
  recordMyVote: (itemId, value) =>
    set((state) => ({ myVotes: { ...state.myVotes, [itemId]: value } })),
  setPendingMatch: (pendingMatch) => set({ pendingMatch }),
  setPartnerDisconnected: (partnerDisconnected) => set({ partnerDisconnected }),
  setConnectionError: (connectionError) => set({ connectionError }),
  reset: () => set(initialState),
}));
