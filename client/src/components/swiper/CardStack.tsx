import { Item } from "../../types";
import { SwipeCard } from "./SwipeCard";

interface Props {
  items: Item[];
  votedIds: Set<string>;
  onVote: (itemId: string, direction: "left" | "right") => void;
}

export function CardStack({ items, votedIds, onVote }: Props) {
  const remaining = items.filter((item) => !votedIds.has(item.id));

  if (remaining.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🎉</p>
          <p className="text-xl font-bold text-gray-700">All done!</p>
          <p className="text-gray-400 text-sm mt-1">Check your matches below</p>
        </div>
      </div>
    );
  }

  // Show top 3 cards
  const visibleCards = remaining.slice(0, 3);

  return (
    <div className="relative w-full h-full">
      {visibleCards
        .slice()
        .reverse()
        .map((item, reversedIdx) => {
          const stackIndex = visibleCards.length - 1 - reversedIdx;
          const isTop = stackIndex === 0;
          return (
            <SwipeCard
              key={item.id}
              item={item}
              onVote={onVote}
              isTop={isTop}
              stackIndex={stackIndex}
            />
          );
        })}
      <div className="absolute bottom-2 right-3 text-xs text-gray-300">
        {remaining.length} left
      </div>
    </div>
  );
}
