import { useNavigate } from "react-router-dom";
import { useRoomStore } from "../store/useRoomStore";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "../types";

export function MatchesPage() {
  const navigate = useNavigate();
  const { room } = useRoomStore();

  if (!room) {
    navigate("/");
    return null;
  }

  const matches = [...room.matches].reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6">
      <div className="max-w-sm mx-auto space-y-5">
        {/* Header */}
        <div className="flex justify-end">
          <DarkModeToggle />
        </div>
        <div className="text-center">
          <div className="text-5xl mb-2">💑</div>
          <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100">Your Matches</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Things you both want to do</p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm text-center">
            <div className="text-4xl mb-3">🃏</div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">No matches yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Keep swiping!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {matches.map((match) => (
              <li
                key={match.item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4"
              >
                <div className="text-3xl">{CATEGORY_ICONS[match.item.category]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 dark:text-gray-100">{match.item.text}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {CATEGORY_LABELS[match.item.category]}
                  </p>
                </div>
                <span className="text-emerald-500 text-xl">✓</span>
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="space-y-3 pb-8">
          <button
            onClick={() => navigate(`/room/${room.code}`)}
            className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-95 transition-all"
          >
            ← Back to Swiping
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Start a new room
          </button>
        </div>
      </div>
    </div>
  );
}
