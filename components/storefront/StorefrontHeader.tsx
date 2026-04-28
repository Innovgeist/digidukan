import Image from "next/image";

interface Props {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  primaryColor: string;
  isOpen: boolean;
}

export function StorefrontHeader({
  name,
  description,
  logoUrl,
  coverUrl,
  primaryColor,
  isOpen,
}: Props) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="max-w-lg mx-auto">
      {/* Cover */}
      <div className="relative h-40 sm:h-52 w-full overflow-hidden bg-paper-3">
        {(() => {
          const hasCover = !!coverUrl && coverUrl.trim().length > 0;
          const src = hasCover ? coverUrl! : "/shop.png";
          return (
            <Image
              src={src}
              alt={hasCover ? `${name} cover` : ""}
              fill
              className="object-cover"
              priority
              unoptimized={!hasCover || !coverUrl!.includes("res.cloudinary.com")}
            />
          );
        })()}
        <div className="absolute inset-0 bg-grain opacity-40" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
      </div>

      {/* Body */}
      <div className="px-5 pt-0 pb-5 reveal-up">
        {/* Logo + open badge row */}
        <div className="flex items-end justify-between -mt-12 mb-3">
          <div className="relative">
            {logoUrl ? (
              <div
                className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(31,24,18,0.15)]"
                style={{ border: `3px solid ${primaryColor}`, background: "var(--color-paper-2)" }}
              >
                <Image
                  src={logoUrl}
                  alt={`${name} logo`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  unoptimized={!logoUrl.includes("res.cloudinary.com")}
                />
              </div>
            ) : (
              <div
                className="w-24 h-24 rounded-2xl shadow-[0_8px_24px_rgba(31,24,18,0.15)] flex items-center justify-center font-display font-bold text-white text-4xl"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                  border: `3px solid ${primaryColor}`,
                }}
              >
                {initial}
              </div>
            )}
          </div>

          {/* Open / Closed stamp */}
          <span
            className={`stamp text-[10px] font-bold px-3 py-1.5 rounded-md mb-1 -rotate-3 shadow-sm border ${
              isOpen
                ? "bg-leaf-soft text-leaf border-leaf/30"
                : "bg-brick-soft text-brick border-brick/30"
            }`}
          >
            {isOpen ? "● Open Now" : "● Closed"}
          </span>
        </div>

        {/* Name */}
        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-ink leading-[1.05] tracking-tight">
          {name}
        </h1>

        {/* Description */}
        {description && (
          <p className="mt-2 text-[15px] text-ink-2 leading-relaxed max-w-md">
            {description}
          </p>
        )}

        {/* Hand-drawn rule line */}
        <div className="rule-line mt-4 opacity-80" />
      </div>
    </header>
  );
}
