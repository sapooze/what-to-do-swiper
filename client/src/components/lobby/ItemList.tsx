import { Item, CATEGORY_ICONS, CATEGORY_LABELS } from "../../types";
import { socket } from "../../socket/socket";

interface Props {
  items: Item[];
  roomCode: string;
  currentUserId: string;
}

export function ItemList({ items, roomCode, currentUserId }: Props) {
  const removeItem = (itemId: string) => {
    socket.emit("remove-item", { roomCode, itemId });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
        No items yet. Add something above!
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700"
        >
          <span className="text-lg">{CATEGORY_ICONS[item.category]}</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{item.text}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {CATEGORY_LABELS[item.category]} · by{" "}
              {item.addedBy === currentUserId ? "you" : item.addedByName}
            </p>
          </div>
          {item.addedBy === currentUserId && (
            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 transition-colors text-lg leading-none"
              title="Remove"
            >
              ×
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
