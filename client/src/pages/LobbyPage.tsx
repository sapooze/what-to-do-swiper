import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
import { useRoomStore } from "../store/useRoomStore";
import { RoomCodeDisplay } from "../components/lobby/RoomCodeDisplay";
import { PartnerStatus } from "../components/lobby/PartnerStatus";
import { AddItemForm } from "../components/lobby/AddItemForm";
import { ItemList } from "../components/lobby/ItemList";
import { Room } from "../types";

interface Props {
  room: Room;
  userId: string;
}

export function LobbyPage({ room, userId }: Props) {
  const navigate = useNavigate();
  const { partnerDisconnected, setPartnerDisconnected } = useRoomStore();
  const [readyClicked, setReadyClicked] = useState(false);

  const hasPartner = room.users.length >= 2;

  const handleStartSwiping = () => {
    setReadyClicked(true);
    socket.emit("start-swiping", { roomCode: room.code });
  };

  const currentUser = room.users.find((u) => u.id === userId);
  const isReady = currentUser?.isReady || readyClicked;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-6">
      <div className="max-w-sm mx-auto space-y-5">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-800">Set Up Your List</h1>
          <p className="text-gray-400 text-sm mt-1">Add things you'd like to do</p>
        </div>

        {/* Room code */}
        <RoomCodeDisplay code={room.code} />

        {/* Partner status */}
        <div className="px-1">
          {partnerDisconnected ? (
            <div className="flex items-center gap-2 text-sm text-amber-600 font-medium">
              <span>⚠️</span> Partner disconnected
              <button
                className="ml-auto text-xs text-gray-400 underline"
                onClick={() => setPartnerDisconnected(false)}
              >
                Dismiss
              </button>
            </div>
          ) : (
            <PartnerStatus users={room.users} currentUserId={userId} />
          )}
        </div>

        {/* Add item form */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-700">Add Items</h2>
          <AddItemForm roomCode={room.code} />
        </div>

        {/* Item list */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-700">Items ({room.items.length})</h2>
          </div>
          <ItemList items={room.items} roomCode={room.code} currentUserId={userId} />
        </div>

        {/* Start button */}
        <div className="pb-6">
          {!hasPartner ? (
            <div className="text-center text-sm text-gray-400 py-4">
              Share the room code with your partner to start swiping
            </div>
          ) : room.items.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-4">
              Add at least one item to start
            </div>
          ) : isReady ? (
            <div className="text-center text-sm text-indigo-500 font-medium py-4 animate-pulse">
              Waiting for your partner to be ready...
            </div>
          ) : (
            <button
              onClick={handleStartSwiping}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
            >
              Start Swiping 🃏
            </button>
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Leave room
        </button>
      </div>
    </div>
  );
}
