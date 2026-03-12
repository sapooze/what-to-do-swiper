import { Item, CATEGORY_ICONS, CATEGORY_LABELS } from "../../types";
import { useSwipe } from "../../hooks/useSwipe";

interface Props {
  item: Item;
  onVote: (itemId: string, direction: "left" | "right") => void;
  isTop: boolean;
  stackIndex: number;
}

export function SwipeCard({ item, onVote, isTop, stackIndex }: Props) {
  const { dragStyle, swipeDirection, triggerSwipe, pointerHandlers } = useSwipe({
    onSwipe: (direction) => onVote(item.id, direction),
  });

  const stackStyle = !isTop
    ? {
        transform: `scale(${1 - stackIndex * 0.04}) translateY(${stackIndex * 10}px)`,
        zIndex: 10 - stackIndex,
        pointerEvents: "none" as const,
      }
    : { zIndex: 20 };

  return (
    <div
      className="absolute inset-0"
      style={isTop ? { ...dragStyle, ...stackStyle } : stackStyle}
      {...(isTop ? pointerHandlers : {})}
    >
      <div className="w-full h-full bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col p-6 select-none overflow-hidden">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-auto">
          <span className="text-2xl">{CATEGORY_ICONS[item.category]}</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {CATEGORY_LABELS[item.category]}
          </span>
        </div>

        {/* Item text */}
        <div className="flex-1 flex items-center justify-center py-4">
          <p className="text-3xl font-bold text-gray-800 text-center leading-tight">
            {item.text}
          </p>
        </div>

        {/* Added by */}
        <p className="text-xs text-gray-300 text-center mt-auto">
          added by {item.addedByName}
        </p>

        {/* Swipe indicators */}
        {isTop && (
          <>
            <div
              className="absolute inset-0 bg-emerald-400/20 rounded-3xl flex items-center justify-center transition-opacity"
              style={{ opacity: swipeDirection === "right" ? 1 : 0 }}
            >
              <span className="text-6xl rotate-[-15deg]">❤️</span>
            </div>
            <div
              className="absolute inset-0 bg-red-400/20 rounded-3xl flex items-center justify-center transition-opacity"
              style={{ opacity: swipeDirection === "left" ? 1 : 0 }}
            >
              <span className="text-6xl rotate-[15deg]">✕</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
