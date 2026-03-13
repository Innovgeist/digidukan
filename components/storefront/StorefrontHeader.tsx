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
    <div className="max-w-lg mx-auto">
      {/* Cover */}
      <div className="relative h-40 md:h-52 w-full overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`${name} cover`}
            fill
            className="object-cover"
            priority
            unoptimized={!coverUrl.includes("res.cloudinary.com")}
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: primaryColor }} />
        )}
      </div>

      {/* Profile row */}
      <div className="px-4 pb-4">
        {/* Logo */}
        <div className="mb-3 -mt-8 relative inline-block">
          {logoUrl ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <Image
                src={logoUrl}
                alt={`${name} logo`}
                width={64}
                height={64}
                className="object-cover"
                unoptimized={!logoUrl.includes("res.cloudinary.com")}
              />
            </div>
          ) : (
            <div
              className="w-16 h-16 rounded-full border-2 border-white shadow-sm flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              <span className="text-white text-2xl font-bold">{initial}</span>
            </div>
          )}
        </div>

        {/* Name and badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold text-gray-900">{name}</h1>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
