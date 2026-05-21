import Image from "next/image";

interface Props {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  primaryColor: string;
  isOpen: boolean;
}

export function HeaderPremium({
  name,
  description,
  logoUrl,
  coverUrl,
  primaryColor,
  isOpen,
}: Props) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="max-w-lg mx-auto bg-[var(--color-heritage-cream)]">
      {/* Emerald chrome bar with ivory cartouche logo plate */}
      <div className="bg-[var(--color-heritage-emerald)] h-16 flex items-center justify-between px-5">
        <div className="relative inline-flex items-center bg-[var(--color-heritage-ivory)] border border-[var(--color-heritage-brass)] px-3 py-1.5 max-w-[78%]">
          <span
            className="font-[family-name:var(--font-heritage)] font-semibold text-[15px] tracking-tight text-[var(--color-heritage-emerald)] truncate"
            title={name}
          >
            {name}
          </span>
          <span
            className="absolute -top-1 -left-1 w-2 h-2 bg-[var(--color-heritage-brass)]"
            aria-hidden
          />
          <span
            className="absolute -bottom-1 -right-1 w-2 h-2 bg-[var(--color-heritage-brass)]"
            aria-hidden
          />
        </div>

        <span className="heritage-label text-[10px] text-[var(--color-heritage-brass)]">
          Est. Heritage
        </span>
      </div>

      {/* Cover image with open-badge ribbon */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[var(--color-heritage-cream-deep)]">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`${name} cover`}
            fill
            className="object-cover"
            priority
            unoptimized={!coverUrl.includes("res.cloudinary.com")}
          />
        ) : logoUrl ? (
          <Image
            src={logoUrl}
            alt={name}
            fill
            className="object-contain p-12 opacity-90"
            priority
            unoptimized={!logoUrl.includes("res.cloudinary.com")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-32 h-32 flex items-center justify-center font-[family-name:var(--font-heritage)] font-semibold text-7xl bg-[var(--color-heritage-ivory)]"
              style={{
                color: primaryColor,
                border: `1px solid var(--color-heritage-brass)`,
              }}
            >
              {initial}
            </div>
          </div>
        )}

        {/* Open / closed brass-bordered badge */}
        <div className="absolute bottom-4 left-5">
          <div className="bg-[var(--color-heritage-ivory)] border border-[var(--color-heritage-brass)] px-3 py-1.5 flex items-center gap-2 shadow-[0_4px_12px_rgba(30,27,19,0.18)]">
            <span
              className={`w-2 h-2 rounded-full ${
                isOpen
                  ? "bg-[var(--color-heritage-emerald-2)]"
                  : "bg-[var(--color-heritage-maroon)]"
              }`}
              aria-hidden
            />
            <span className="heritage-label text-[10px] text-[var(--color-heritage-ink)]">
              {isOpen ? "Open Today" : "Currently Closed"}
            </span>
          </div>
        </div>
      </div>

      {/* Centered serif title + description */}
      <div className="px-6 pt-8 pb-6 text-center heritage-fade-up">
        <h1 className="font-[family-name:var(--font-heritage)] font-semibold italic text-[34px] sm:text-[40px] leading-tight tracking-tight text-[var(--color-heritage-emerald)]">
          {name}
        </h1>
        <div className="flex justify-center mt-3">
          <span
            className="block w-12 h-px bg-[var(--color-heritage-brass)]"
            aria-hidden
          />
        </div>
        {description && (
          <p className="mt-4 max-w-md mx-auto font-[family-name:var(--font-inter)] text-[15px] leading-relaxed text-[var(--color-heritage-ink-soft)]">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
