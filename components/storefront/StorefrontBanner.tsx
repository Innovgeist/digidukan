interface Props {
  text: string;
}

export function StorefrontBanner({ text }: Props) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center max-w-lg mx-auto">
      <p className="text-amber-800 text-sm font-medium">📢 {text}</p>
    </div>
  );
}
