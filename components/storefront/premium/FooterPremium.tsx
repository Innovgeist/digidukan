interface Props {
  showWatermark: boolean;
}

export function FooterPremium({ showWatermark }: Props) {
  return (
    <footer className="mt-8 max-w-lg mx-auto">
      <div className="bg-[var(--color-heritage-emerald)] px-5 py-6 text-center">
        <p className="heritage-label text-[10px] text-[var(--color-heritage-brass)] tracking-[0.2em]">
          Est. 1894 — Heritage Collection
        </p>
        {showWatermark && (
          <p className="font-[family-name:var(--font-inter)] text-[11px] text-[var(--color-heritage-brass)]/70 mt-2">
            Curated with{" "}
            <a
              href="/"
              className="font-[family-name:var(--font-heritage)] italic font-semibold text-[var(--color-heritage-ivory)] hover:underline underline-offset-2"
            >
              DigiDukan
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}
