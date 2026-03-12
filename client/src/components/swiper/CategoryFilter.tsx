import { Category, CATEGORY_ICONS, CATEGORY_LABELS } from "../../types";

type FilterValue = Category | "all";

interface Props {
  value: FilterValue;
  onChange: (val: FilterValue) => void;
}

const FILTERS: { value: FilterValue; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "✨" },
  { value: "games", label: CATEGORY_LABELS.games, icon: CATEGORY_ICONS.games },
  { value: "movies_tv", label: CATEGORY_LABELS.movies_tv, icon: CATEGORY_ICONS.movies_tv },
  { value: "activities", label: CATEGORY_LABELS.activities, icon: CATEGORY_ICONS.activities },
];

export function CategoryFilter({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
            value === f.value
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-500 border border-gray-200 hover:border-indigo-300"
          }`}
        >
          {f.icon} {f.label}
        </button>
      ))}
    </div>
  );
}
