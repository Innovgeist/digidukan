"use client";

import { Tag } from "lucide-react";

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
  primaryColor = "#3B82F6",
}: Props) {
  const handleClick = (id: string) => {
    onSelect(selected === id ? null : id);
  };

  return (
    <div className="px-4 py-3">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {collections.map((col) => {
          const isActive = selected === col.id;
          return (
            <button
              key={col.id}
              onClick={() => handleClick(col.id)}
              className="whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all"
              style={
                isActive
                  ? {
                      backgroundColor: primaryColor,
                      color: "#fff",
                      borderColor: primaryColor,
                      boxShadow: `0 2px 8px ${primaryColor}40`,
                    }
                  : {
                      backgroundColor: "#fff",
                      color: "#374151",
                      borderColor: "#e5e7eb",
                    }
              }
            >
              <Tag className="w-3 h-3" />
              {col.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
