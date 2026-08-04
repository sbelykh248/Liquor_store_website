"use client";

import { CATEGORIES } from "@/lib/types";
import type { CategoryId } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { cn } from "@/lib/utils";

export default function CategoryRail({
  selection,
  onSelect,
  countFor,
  availableCategories,
}: {
  selection: CategoryId;
  onSelect: (id: CategoryId) => void;
  countFor: (id: CategoryId) => number;
  availableCategories: CategoryId[];
}) {
  const categories = CATEGORIES.filter((c) => availableCategories.includes(c.id));

  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.id];
        const isActive = category.id === selection;
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2.5 text-[12.5px] font-semibold transition-colors",
              isActive
                ? "border-brass bg-gradient-to-b from-brass to-brass-soft text-ink"
                : "border-hairline bg-surface text-cream-muted hover:border-hairline hover:text-cream"
            )}
          >
            <Icon size={13} strokeWidth={2.25} />
            {category.title}
            <span className="opacity-55">{countFor(category.id)}</span>
          </button>
        );
      })}
    </div>
  );
}
