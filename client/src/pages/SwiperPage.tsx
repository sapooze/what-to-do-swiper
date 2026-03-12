import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
import { useRoomStore } from "../store/useRoomStore";
import { CardStack } from "../components/swiper/CardStack";
import { SwipeButtons } from "../components/swiper/SwipeButtons";
import { CategoryFilter } from "../components/swiper/CategoryFilter";
import { MatchToast } from "../components/match/MatchToast";
import { Room, Category } from "../types";

type FilterValue = Category | "all";

interface Props {
  room: Room;
  userId: string;
}

export function SwiperPage({ room, userId: _userId }: Props) {
  const navigate = useNavigate();
  const { myVotes, recordMyVote, pendingMatch, setPendingMatch, partnerDisconnected } =
    useRoomStore();
  const [filter, setFilter] = useState<FilterValue>("all");

  const votedIds = new Set(Object.keys(myVotes));

  const filteredItems =
    filter === "all" ? room.items : room.items.filter((i) => i.category === filter);

  const nextUnvotedItem = filteredItems.find((i) => !votedIds.has(i.id));

  const handleVote = (itemId: string, direction: "left" | "right") => {
    const value = direction === "right" ? "like" : "dislike";
    recordMyVote(itemId, value);
    socket.emit("vote", { roomCode: room.code, itemId, value });
  };

  const handleButtonVote = (direction: "left" | "right") => {
    if (!nextUnvotedItem) return;
    handleVote(nextUnvotedItem.id, direction);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-800">Swipe!</h1>
            <p className="text-xs text-gray-400">Swipe right to like, left to skip</p>
          </div>
          <button
            onClick={() => navigate(`/matches/${room.code}`)}
            className="relative px-3 py-2 bg-white rounded-xl shadow-sm border border-gray-100 text-sm font-semibold text-indigo-600"
          >
            Matches
            {room.matches.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {room.matches.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Partner disconnected banner */}
      {partnerDisconnected && (
        <div className="mx-4 mb-2">
          <div className="max-w-sm mx-auto bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm text-amber-700">
            ⚠️ Partner disconnected — you can still keep swiping
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="px-4 py-2">
        <div className="max-w-sm mx-auto">
          <CategoryFilter value={filter} onChange={setFilter} />
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="max-w-sm w-full" style={{ height: "380px" }}>
          <CardStack
            items={filteredItems}
            votedIds={votedIds}
            onVote={handleVote}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="px-4 py-6">
        <div className="max-w-sm mx-auto">
          <SwipeButtons
            onDislike={() => handleButtonVote("left")}
            onLike={() => handleButtonVote("right")}
            disabled={!nextUnvotedItem}
          />
        </div>
      </div>

      {/* Match toast */}
      {pendingMatch && (
        <MatchToast match={pendingMatch} onDismiss={() => setPendingMatch(null)} />
      )}
    </div>
  );
}
