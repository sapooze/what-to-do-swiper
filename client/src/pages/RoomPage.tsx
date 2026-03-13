import { useParams, useNavigate } from "react-router-dom";
import { useRoomStore } from "../store/useRoomStore";
import { LobbyPage } from "./LobbyPage";
import { SwiperPage } from "./SwiperPage";

export function RoomPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { room, userId } = useRoomStore();

  // Room not in store — user may have navigated directly
  if (!room || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-5xl mb-4">🔌</div>
          <p className="text-gray-600 dark:text-gray-300 font-medium mb-4">Session not found</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Sanity check — URL matches the room in store
  if (code && room.code !== code.toUpperCase()) {
    navigate("/");
    return null;
  }

  if (room.phase === "lobby") {
    return <LobbyPage room={room} userId={userId} />;
  }

  return <SwiperPage room={room} userId={userId} />;
}
