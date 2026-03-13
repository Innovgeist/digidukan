import Image from "next/image";

interface Item {
  id: string;
  name: string;
  price: number;
  oldPrice: number | null;
  description?: string | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  dietaryType: string;
  categoryName: string;
}

interface Props {
  items: Item[];
  primaryColor?: string;
}

function dietaryDot(dietaryType: string) {
  if (dietaryType === "VEG") return <span title="Veg">🟢</span>;
  if (dietaryType === "NON_VEG") return <span title="Non-Veg">🔴</span>;
  if (dietaryType === "EGG") return <span title="Egg">🥚</span>;
  return null;
}

export function FeaturedSection({ items, primaryColor = "#3B82F6" }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="px-4 mb-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        ⭐ Featured
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-36 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Image */}
            <div className="relative w-full h-28 bg-gray-100">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  unoptimized={!item.imageUrl.includes("res.cloudinary.com")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-3xl">🛍️</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-2">
              <div className="flex items-center gap-1 mb-0.5">
                {dietaryDot(item.dietaryType)}
                <p className="text-xs font-medium text-gray-900 truncate flex-1">
                  {item.name}
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-sm font-bold"
                  style={{ color: primaryColor }}
                >
                  ₹{item.price}
                </span>
                {item.oldPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{item.oldPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
