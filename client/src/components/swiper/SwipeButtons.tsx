interface Props {
  onDislike: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export function SwipeButtons({ onDislike, onLike, disabled }: Props) {
  return (
    <div className="flex items-center justify-center gap-8">
      <button
        onClick={onDislike}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-red-200 text-2xl flex items-center justify-center hover:bg-red-50 hover:border-red-400 active:scale-95 transition-all disabled:opacity-30"
        title="Nope"
      >
        ✕
      </button>
      <button
        onClick={onLike}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-emerald-200 text-2xl flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-400 active:scale-95 transition-all disabled:opacity-30"
        title="Yes!"
      >
        ❤️
      </button>
    </div>
  );
}
