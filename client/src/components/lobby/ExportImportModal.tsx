import { useState, useEffect } from "react";
import { Item, Category } from "../../types";
import { socket } from "../../socket/socket";

interface ExportItem {
  text: string;
  category: Category;
}

interface Props {
  mode: "export" | "import";
  items: Item[];
  roomCode: string;
  onClose: () => void;
}

function encodeList(items: Item[]): string {
  const exportItems: ExportItem[] = items.map((i) => ({
    text: i.text,
    category: i.category,
  }));
  return btoa(JSON.stringify(exportItems));
}

function decodeList(code: string): ExportItem[] | null {
  try {
    const parsed = JSON.parse(atob(code.trim()));
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (i): i is ExportItem =>
        typeof i.text === "string" &&
        ["games", "movies_tv", "activities"].includes(i.category)
    );
  } catch {
    return null;
  }
}

export function ExportImportModal({ mode, items, roomCode, onClose }: Props) {
  const [code, setCode] = useState(mode === "export" ? encodeList(items) : "");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [imported, setImported] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    const list = decodeList(code);
    if (!list || list.length === 0) {
      setError("Invalid code. Please check and try again.");
      return;
    }
    for (const item of list) {
      socket.emit("add-item", {
        roomCode,
        text: item.text,
        category: item.category,
      });
    }
    setImported(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-800 dark:text-gray-100">
            {mode === "export" ? "Export List" : "Import List"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {mode === "export" ? (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share this code to restore all {items.length} item
              {items.length !== 1 ? "s" : ""} from this list in a future room.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 font-mono text-xs text-gray-700 dark:text-gray-300 break-all select-all border border-gray-200 dark:border-gray-600">
              {code}
            </div>
            <button
              onClick={handleCopy}
              className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-95 transition-all"
            >
              {copied ? "✓ Copied!" : "📋 Copy Code"}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Paste a list code to restore its items into this room.
            </p>
            <textarea
              className="w-full h-28 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              placeholder="Paste your list code here..."
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
            />
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
            {imported ? (
              <div className="w-full py-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ Items added!
              </div>
            ) : (
              <button
                onClick={handleImport}
                disabled={!code.trim()}
                className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-40"
              >
                Import List
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
