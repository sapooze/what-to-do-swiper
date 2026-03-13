import { useState, FormEvent } from "react";
import { socket } from "../socket/socket";
import { useRoomStore } from "../store/useRoomStore";
import { DarkModeToggle } from "../components/DarkModeToggle";

export function HomePage() {
  const [tab, setTab] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const { connectionError, setConnectionError } = useRoomStore();

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setConnectionError(null);
    socket.emit("create-room", { userName: name.trim() });
  };

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roomCode.trim()) return;
    setConnectionError(null);
    socket.emit("join-room", {
      roomCode: roomCode.trim().toUpperCase(),
      userName: name.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Dark mode toggle */}
        <div className="flex justify-end mb-2">
          <DarkModeToggle />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🤔</div>
          <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100">What To Do?</h1>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Swipe together, decide together</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setTab("create")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === "create"
                  ? "bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Create Room
            </button>
            <button
              onClick={() => setTab("join")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === "join"
                  ? "bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Join Room
            </button>
          </div>

          {connectionError && (
            <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
              {connectionError}
            </div>
          )}

          {tab === "create" ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                  Your nickname
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  maxLength={30}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-base disabled:opacity-40 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Create Room
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                  Your nickname
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  maxLength={30}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                  Room code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BRAVE-WOLF-42"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm font-mono tracking-wider"
                  maxLength={20}
                />
              </div>
              <button
                type="submit"
                disabled={!name.trim() || !roomCode.trim()}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-base disabled:opacity-40 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Join Room
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-300 dark:text-gray-600 mt-6">
          No account needed · Rooms expire after 24h
        </p>
      </div>
    </div>
  );
}
