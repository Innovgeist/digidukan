import { Megaphone } from "lucide-react";

interface Props {
  text: string;
}

export function StorefrontBanner({ text }: Props) {
  return (
    <div className="max-w-lg mx-auto px-5 pt-1 pb-3">
      <div className="relative overflow-hidden rounded-2xl bg-saffron-soft border border-saffron/25 px-4 py-3 flex items-start gap-3">
        <span className="w-9 h-9 rounded-xl bg-saffron flex items-center justify-center shrink-0 shadow-[0_2px_0_rgba(168,67,26,0.25)]">
          <Megaphone className="w-4 h-4 text-white" strokeWidth={2.2} />
        </span>
        <p className="text-[14px] leading-snug font-medium text-saffron-deep pt-1.5">
          {text}
        </p>
        <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />
      </div>
    </div>
  );
}
