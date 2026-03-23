import Image from "next/image";
import Link from "next/link";

const allImages = [
  "/landing1.png",
  "/landing2.png",
  "/landing3.png",
  "/landing4.png",
  "/landing5.png",
  "/landing6.png",
  "/landing7.png",
  "/landing8.png",
];

const row1 = [...allImages, ...allImages];
const row2 = [...allImages, ...allImages];
const row3 = [...allImages, ...allImages];

function CarouselRow({
  images,
  direction,
}: {
  images: string[];
  direction: "left" | "right";
}) {
  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-3 w-max ${
          direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
        }`}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="relative w-[500px] h-[300px] md:w-[650px] md:h-[33vh] flex-shrink-0 rounded-xl overflow-hidden"
          >
            <Image
              src={src}
              alt="Local business"
              fill
              className="object-cover"
              sizes="650px"
              priority={i < 8}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden">
      {/* Carousel background */}
      <div className="absolute inset-0 flex flex-col justify-center gap-3 opacity-30">
        <CarouselRow images={row1} direction="left" />
        <CarouselRow images={row2} direction="right" />
        <CarouselRow images={row3} direction="left" />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/80" />

      {/* Top nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 lg:px-24 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="DigiDukan logo"
            width={40}
            height={40}
            className="drop-shadow-lg"
          />
          <span className="text-xl font-bold text-white tracking-tight">
            DigiDukan
          </span>
        </Link>
      </nav>

      {/* Auth form — centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-3 sm:py-4 px-4 sm:px-8 md:px-16 lg:px-24 flex items-center justify-between border-t border-slate-800/50">
        <p className="text-slate-500 text-[10px] sm:text-xs">
          &copy; {new Date().getFullYear()} DigiDukan
        </p>
        <p className="text-slate-500 text-[10px] sm:text-xs">
          by{" "}
          <a
            href="https://www.innovgeist.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors font-medium"
          >
            innovgeist
          </a>
        </p>
      </footer>
    </div>
  );
}
