import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSocket } from "./hooks/useSocket";
import { useRoomStore } from "./store/useRoomStore";
import { HomePage } from "./pages/HomePage";
import { RoomPage } from "./pages/RoomPage";
import { MatchesPage } from "./pages/MatchesPage";

export function App() {
  useSocket();
  const darkMode = useRoomStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:code" element={<RoomPage />} />
      <Route path="/matches/:code" element={<MatchesPage />} />
    </Routes>
  );
}
