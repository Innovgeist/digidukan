import Link from "next/link";
import Image from "next/image";
import {
  QrCode,
  MessageCircle,
  Store,
  BarChart3,
  Smartphone,
  Zap,
} from "lucide-react";

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

const features = [
  {
    icon: Store,
    title: "Digital Storefront",
    desc: "Set up your online dukaan in minutes.",
  },
  {
    icon: QrCode,
    title: "QR Code Sharing",
    desc: "Print it, stick it, customers scan to browse.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Ordering",
    desc: "Customers order directly via WhatsApp.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    desc: "Built for the way India shops.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Track views, scans, and clicks.",
  },
  {
    icon: Zap,
    title: "Zero Cost",
    desc: "Start free. No commissions, no fees.",
  },
];

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
            className="relative w-[50vw] h-[33vh] sm:w-[400px] sm:h-[240px] md:w-[650px] md:h-[33vh] flex-shrink-0 rounded-xl overflow-hidden"
          >
            <Image
              src={src}
              alt="Local business"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 280px, (max-width: 768px) 400px, 650px"
              priority={i < 8}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden">
      {/* Carousel background — full screen */}
      <div className="absolute inset-0 flex flex-col justify-center gap-3 opacity-30">
        <CarouselRow images={row1} direction="left" />
        <CarouselRow images={row2} direction="right" />
        <CarouselRow images={row3} direction="left" />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/80" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-4 sm:px-8 md:px-16 lg:px-24 py-5 sm:py-8">
        {/* Top nav bar */}
        <nav className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/logo.png"
              alt="DigiDukan logo"
              width={36}
              height={36}
              className="drop-shadow-lg sm:w-11 sm:h-11"
            />
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              DigiDukan
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-block text-slate-300 hover:text-white transition-colors font-medium px-4 py-2 text-sm"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-500 transition-colors text-sm"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero — center */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto py-6 sm:py-0">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-3 sm:mb-5">
            Your Dukaan,
            <br />
            <span className="text-blue-400">Now Digital</span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 max-w-xl leading-relaxed">
            Create your digital storefront, share via QR code, and let customers
            order directly on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-blue-500 transition-colors text-base sm:text-lg text-center"
            >
              Create Your Store
            </Link>
            <Link
              href="/login"
              className="border border-slate-500 text-slate-200 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors text-base sm:text-lg text-center"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features — bottom */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 w-full">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center text-center gap-1 sm:gap-2 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-4 py-3 sm:py-5 border border-white/10"
            >
              <div className="p-1.5 sm:p-2.5 rounded-lg bg-blue-600/20">
                <f.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-white leading-tight">
                {f.title}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 leading-tight hidden sm:block">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
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
    </main>
  );
}
