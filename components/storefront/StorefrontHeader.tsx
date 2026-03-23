import Image from "next/image";
import { CheckCircle, Clock } from "lucide-react";

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
      {/* Cover with gradient overlay */}
      <div className="relative h-44 md:h-56 w-full overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Profile row */}
      <div className="px-4 pb-4">
        {/* Logo */}
        <div className="mb-3 -mt-10 relative inline-block">
          {logoUrl ? (
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden shadow-md"
              style={{ border: `3px solid ${primaryColor}` }}
            >
              <Image
                src={logoUrl}
                alt={`${name} logo`}
                width={80}
                height={80}
                className="object-cover"
                unoptimized={!logoUrl.includes("res.cloudinary.com")}
              />
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-full shadow-md flex items-center justify-center"
              style={{ backgroundColor: primaryColor, border: `3px solid ${primaryColor}` }}
            >
              <span className="text-white text-3xl font-bold">{initial}</span>
            </div>
          )}
        </div>

        {/* Name and badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{name}</h1>
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isOpen ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {description && (
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
