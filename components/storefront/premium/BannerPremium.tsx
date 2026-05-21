interface Props {
  text: string;
}

export function BannerPremium({ text }: Props) {
  return (
    <div className="max-w-lg mx-auto px-5 pb-4">
      <div className="relative bg-[var(--color-heritage-cream-soft)] border-y border-[var(--color-heritage-maroon)]/40 px-5 py-4">
        <p className="heritage-label text-[10px] text-[var(--color-heritage-maroon-deep)] mb-1">
          Notice
        </p>
        <p className="font-[family-name:var(--font-heritage)] italic text-[15px] leading-snug text-[var(--color-heritage-ink)]">
          {text}
        </p>
      </div>
    </div>
  );
}
