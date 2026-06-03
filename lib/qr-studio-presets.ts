export type CardSize = "large" | "medium" | "small";

export type LayoutPresetId =
  | "1-large"
  | "4-medium"
  | "6-small"
  | "8-small";

export interface CardScale {
  topTextClass: string;
  shopNameClass: string;
  brandingClass: string;
  paddingClass: string;
}

export interface LayoutPreset {
  id: LayoutPresetId;
  label: string;
  description: string;
  cards: CardSize[];
  isMixed: boolean;
}

export const CARD_SCALE: Record<CardSize, CardScale> = {
  large: {
    topTextClass: "text-xl",
    shopNameClass: "text-2xl",
    brandingClass: "text-base",
    paddingClass: "p-8",
  },
  medium: {
    topTextClass: "text-base",
    shopNameClass: "text-xl",
    brandingClass: "text-sm",
    paddingClass: "p-5",
  },
  small: {
    topTextClass: "text-[10px]",
    shopNameClass: "text-xs",
    brandingClass: "text-[11px]",
    paddingClass: "p-1",
  },
};

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: "1-large",
    label: "1 Large",
    description: "Full A4, one card",
    cards: ["large"],
    isMixed: false,
  },
  {
    id: "4-medium",
    label: "4 Medium",
    description: "2×2 grid",
    cards: ["medium", "medium", "medium", "medium"],
    isMixed: false,
  },
  {
    id: "6-small",
    label: "6 Small",
    description: "2×3 grid",
    cards: ["small", "small", "small", "small", "small", "small"],
    isMixed: false,
  },
  {
    id: "8-small",
    label: "8 Extra",
    description: "2×4 grid",
    cards: ["small", "small", "small", "small", "small", "small", "small", "small"],
    isMixed: false,
  },
];
