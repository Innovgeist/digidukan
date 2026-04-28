import {
  Coffee,
  Soup,
  Pizza,
  Beef,
  Fish,
  Salad,
  IceCream,
  Cake,
  Cookie,
  Apple,
  Banana,
  Carrot,
  Wheat,
  Croissant,
  Egg,
  Sandwich,
  Drumstick,
  Ham,
  Donut,
  CupSoda,
  Wine,
  Beer,
  Milk,
  Cherry,
  Grape,
  Citrus,
  ChefHat,
  UtensilsCrossed,
  Shirt,
  Gem,
  Sparkles,
  Flower2,
  Heart,
  Gift,
  Scissors,
  Brush,
  Leaf,
  Palette,
  ShoppingBag,
  Package,
  type LucideIcon,
} from "lucide-react";

type Rule = { keys: string[]; icon: LucideIcon };

// Order matters — first match wins, so put more specific terms first.
const RULES: Rule[] = [
  { keys: ["coffee", "espresso", "latte", "cappuccino", "mocha", "americano"], icon: Coffee },
  { keys: ["tea", "chai", "matcha"], icon: Coffee },
  { keys: ["pizza", "margherita", "pepperoni"], icon: Pizza },
  { keys: ["burger", "sandwich", "wrap", "sub"], icon: Sandwich },
  { keys: ["chicken", "tandoori", "tikka", "kebab", "wings"], icon: Drumstick },
  { keys: ["mutton", "lamb", "beef", "steak"], icon: Beef },
  { keys: ["pork", "ham", "bacon", "sausage"], icon: Ham },
  { keys: ["fish", "prawn", "shrimp", "seafood"], icon: Fish },
  { keys: ["egg", "omelet", "omelette"], icon: Egg },
  { keys: ["salad", "greens", "veggies"], icon: Salad },
  { keys: ["soup", "broth", "stew", "dal", "curry"], icon: Soup },
  { keys: ["ice cream", "icecream", "kulfi", "gelato", "sorbet"], icon: IceCream },
  { keys: ["cake", "pastry", "muffin", "cupcake", "brownie"], icon: Cake },
  { keys: ["cookie", "biscuit", "rusk"], icon: Cookie },
  { keys: ["donut", "doughnut"], icon: Donut },
  { keys: ["croissant", "roll", "bun"], icon: Croissant },
  { keys: ["bread", "naan", "roti", "paratha", "kulcha", "wheat", "atta", "flour"], icon: Wheat },
  { keys: ["juice", "smoothie", "shake", "soda", "drink", "lassi", "cola"], icon: CupSoda },
  { keys: ["wine", "champagne"], icon: Wine },
  { keys: ["beer", "ale", "lager"], icon: Beer },
  { keys: ["milk", "dairy", "yogurt", "curd", "paneer", "cheese", "butter", "ghee"], icon: Milk },
  { keys: ["apple"], icon: Apple },
  { keys: ["banana"], icon: Banana },
  { keys: ["cherry", "berry", "strawberry"], icon: Cherry },
  { keys: ["grape", "raisin"], icon: Grape },
  { keys: ["lemon", "lime", "orange", "citrus", "mosambi"], icon: Citrus },
  { keys: ["carrot", "vegetable", "veg"], icon: Carrot },
  { keys: ["chef", "special", "signature"], icon: ChefHat },
  { keys: ["combo", "thali", "meal", "platter"], icon: UtensilsCrossed },
  { keys: ["sweet", "dessert", "mithai", "halwa", "barfi", "ladoo", "jalebi"], icon: Cake },
  // Non-food
  { keys: ["shirt", "kurta", "tshirt", "t-shirt", "apparel", "clothing", "dress"], icon: Shirt },
  { keys: ["jewel", "ring", "necklace", "diamond", "gold", "silver"], icon: Gem },
  { keys: ["beauty", "makeup", "lipstick", "cosmetic"], icon: Sparkles },
  { keys: ["flower", "bouquet", "rose"], icon: Flower2 },
  { keys: ["gift", "hamper"], icon: Gift },
  { keys: ["salon", "haircut", "scissor"], icon: Scissors },
  { keys: ["paint", "brush", "color"], icon: Brush },
  { keys: ["herb", "leaf", "plant", "natural", "organic"], icon: Leaf },
  { keys: ["art", "craft"], icon: Palette },
  { keys: ["heart", "love"], icon: Heart },
];

const FALLBACK_POOL: LucideIcon[] = [
  UtensilsCrossed,
  ShoppingBag,
  Package,
  ChefHat,
  Sparkles,
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Pick a lucide icon for an item that has no image.
 * 1) Match against keyword rules using item name + category name.
 * 2) Otherwise pick a deterministic fallback so the same item always shows
 *    the same icon (no flickering between renders, no two adjacent identical
 *    cards by accident — variety comes from the hash).
 */
export function getCategoryIcon(itemName: string, categoryName?: string | null): LucideIcon {
  const haystack = `${itemName} ${categoryName ?? ""}`.toLowerCase();
  for (const rule of RULES) {
    for (const key of rule.keys) {
      if (haystack.includes(key)) return rule.icon;
    }
  }
  const idx = hashString(itemName) % FALLBACK_POOL.length;
  return FALLBACK_POOL[idx];
}
