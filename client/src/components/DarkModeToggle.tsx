import { useRoomStore } from "../store/useRoomStore";

export function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useRoomStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle dark mode"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
