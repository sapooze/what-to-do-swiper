import { useState, FormEvent } from "react";
import { socket } from "../../socket/socket";
import { Category, CATEGORY_LABELS, CATEGORY_ICONS } from "../../types";

interface Props {
  roomCode: string;
}

const CATEGORIES: Category[] = ["games", "movies_tv", "activities"];

export function AddItemForm({ roomCode }: Props) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category>("games");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit("add-item", { roomCode, text: text.trim(), category });
    setText("");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              category === cat
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Add a ${CATEGORY_LABELS[category].toLowerCase()}...`}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
          maxLength={80}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-indigo-700 transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
}
