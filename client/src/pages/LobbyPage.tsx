import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
import { useRoomStore } from "../store/useRoomStore";
import { RoomCodeDisplay } from "../components/lobby/RoomCodeDisplay";
import { PartnerStatus } from "../components/lobby/PartnerStatus";
import { AddItemForm } from "../components/lobby/AddItemForm";
import { ItemList } from "../components/lobby/ItemList";
import { ExportImportModal } from "../components/lobby/ExportImportModal";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { Room } from "../types";

interface Props {
  room: Room;
  userId: string;
}

export function LobbyPage({ room, userId }: Props) {
  const navigate = useNavigate();
  const { partnerDisconnected, setPartnerDisconnected } = useRoomStore();
  const [readyClicked, setReadyClicked] = useState(false);
  const [modal, setModal] = useState<"export" | "import" | null>(null);

  const hasPartner = room.users.length >= 2;

  const handleStartSwiping = () => {
    setReadyClicked(true);
    socket.emit("start-swiping", { roomCode: room.code });
  };

  const currentUser = room.users.find((u) => u.id === userId);
  const isReady = currentUser?.isReady || readyClicked;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6">
      <div className="max-w-sm mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100">Set Up Your List</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">Add things you'd like to do</p>
          </div>
          <DarkModeToggle />
        </div>

        {/* Room code */}
        <RoomCodeDisplay code={room.code} />

        {/* Partner status */}
        <div className="px-1">
          {partnerDisconnected ? (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-medium">
              <span>⚠️</span> Partner disconnected
              <button
                className="ml-auto text-xs text-gray-400 dark:text-gray-500 underline"
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <h2 className="font-bold text-gray-700 dark:text-gray-200">Add Items</h2>
          <AddItemForm roomCode={room.code} />
        </div>

        {/* Item list */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-700 dark:text-gray-200">Items ({room.items.length})</h2>
            {/* Export / Import buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setModal("import")}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Import
              </button>
              <button
                onClick={() => setModal("export")}
                disabled={room.items.length === 0}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors disabled:opacity-40"
              >
                Export
              </button>
            </div>
          </div>
          <ItemList items={room.items} roomCode={room.code} currentUserId={userId} />
        </div>

        {/* Start button */}
        <div className="pb-6">
          {!hasPartner ? (
            <div className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
              Share the room code with your partner to start swiping
            </div>
          ) : room.items.length === 0 ? (
            <div className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
              Add at least one item to start
            </div>
          ) : isReady ? (
            <div className="text-center text-sm text-indigo-500 dark:text-indigo-400 font-medium py-4 animate-pulse">
              Waiting for your partner to be ready...
            </div>
          ) : (
            <button
              onClick={handleStartSwiping}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
            >
              Start Swiping 🃏
            </button>
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full py-2 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ← Leave room
        </button>
      </div>

      {/* Export/Import modal */}
      {modal && (
        <ExportImportModal
          mode={modal}
          items={room.items}
          roomCode={room.code}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
