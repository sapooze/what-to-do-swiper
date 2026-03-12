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
      <div className="text-center py-8 text-gray-400 text-sm">
        No items yet. Add something above!
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100"
        >
          <span className="text-lg">{CATEGORY_ICONS[item.category]}</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">{item.text}</p>
            <p className="text-xs text-gray-400">
              {CATEGORY_LABELS[item.category]} · by{" "}
              {item.addedBy === currentUserId ? "you" : item.addedByName}
            </p>
          </div>
          {item.addedBy === currentUserId && (
            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
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
