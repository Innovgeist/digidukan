"use client";

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
    // Clicking the already-selected chip deselects it
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
              className="whitespace-nowrap flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
              style={
                isActive
                  ? {
                      backgroundColor: primaryColor,
                      color: "#fff",
                      borderColor: primaryColor,
                    }
                  : {
                      backgroundColor: "#fff",
                      color: "#374151",
                      borderColor: "#d1d5db",
                    }
              }
            >
              {col.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
