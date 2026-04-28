"use client";

import { Bookmark } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  coverUrl?: string | null;
  type: string;
}

interface Props {
  collections: Collection[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  primaryColor?: string;
}

export function CollectionChips({
  collections,
  selected,
  onSelect,
  primaryColor = "#D9622E",
}: Props) {
  const handleClick = (id: string) => {
    onSelect(selected === id ? null : id);
  };

  return (
    <div className="px-5 pt-1 pb-3">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {collections.map((col) => {
          const isActive = selected === col.id;
          return (
            <button
              key={col.id}
              onClick={() => handleClick(col.id)}
              className={`press-soft whitespace-nowrap shrink-0 inline-flex items-center gap-2 px-4 h-11 rounded-full text-[14px] font-medium border-2 transition-colors ${
                isActive
                  ? "text-paper border-transparent"
                  : "bg-paper-2 text-ink-2 border-ink-line hover:border-ink-line-strong"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: primaryColor,
                      boxShadow: `0 2px 0 ${primaryColor}40`,
                    }
                  : undefined
              }
            >
              <Bookmark className={`w-3.5 h-3.5 ${isActive ? "" : "text-ink-3"}`} fill={isActive ? "currentColor" : "none"} strokeWidth={2.2} />
              {col.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
