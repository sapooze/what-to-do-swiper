import { Match, CATEGORY_ICONS } from "../../types";

interface Props {
  match: Match;
  onDismiss: () => void;
}

export function MatchToast({ match, onDismiss }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 mx-6 text-center shadow-2xl max-w-sm w-full animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl mb-2">🎉</div>
        <h2 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">It's a Match!</h2>
        <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">You both want to...</p>

        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-5 mb-6">
          <div className="text-3xl mb-1">{CATEGORY_ICONS[match.item.category]}</div>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{match.item.text}</p>
        </div>

        <button
          onClick={onDismiss}
          className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all"
        >
          Keep swiping
        </button>
      </div>
    </div>
  );
}
