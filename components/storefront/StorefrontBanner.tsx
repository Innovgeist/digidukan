import { Megaphone } from "lucide-react";

interface Props {
  text: string;
}

export function StorefrontBanner({ text }: Props) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 max-w-lg mx-auto">
      <p className="text-amber-800 text-sm font-medium flex items-center gap-2">
        <Megaphone className="w-4 h-4 shrink-0 text-amber-600" />
        {text}
      </p>
    </div>
  );
}
