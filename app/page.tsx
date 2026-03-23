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
    desc: "Set up your online dukaan in minutes with categories, items, and branding.",
  },
  {
    icon: QrCode,
    title: "QR Code Sharing",
    desc: "Generate a unique QR code. Print it, stick it, and customers scan to browse.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Ordering",
    desc: "Customers add to cart and place orders directly via WhatsApp — no app needed.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    desc: "Your storefront looks great on every phone. Built for the way India shops.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Track views, QR scans, and WhatsApp clicks. Know what's working.",
  },
  {
    icon: Zap,
    title: "Zero Setup Cost",
    desc: "Start free. No payment gateway, no commissions, no hidden fees.",
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

export default function LandingPage() {
  return (
    <main className="h-screen flex flex-col bg-slate-950 relative overflow-hidden">
      {/* Carousel background — full screen */}
      <div className="absolute inset-0 flex flex-col justify-center gap-3 opacity-30">
        <CarouselRow images={row1} direction="left" />
        <CarouselRow images={row2} direction="right" />
        <CarouselRow images={row3} direction="left" />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/80" />

      {/* Full-width content spread across the screen */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-8 md:px-16 lg:px-24 py-8">
        {/* Top nav bar */}
        <nav className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="DigiDukan logo"
              width={44}
              height={44}
              className="drop-shadow-lg"
            />
            <span className="text-2xl font-bold text-white tracking-tight">
              DigiDukan
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white transition-colors font-medium px-5 py-2"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </nav>

        {/* Hero — center */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-5">
            Your Dukaan,{" "}
            <span className="text-blue-400">Now Digital</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed">
            Create your digital storefront, share via QR code, and let customers
            order directly on WhatsApp — all in under 5 minutes.
          </p>
          <div className="flex gap-4">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-500 transition-colors text-lg"
            >
              Create Your Store
            </Link>
            <Link
              href="/login"
              className="border border-slate-500 text-slate-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors text-lg"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features — bottom, full width */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center text-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-5 border border-white/10"
            >
              <div className="p-2.5 rounded-lg bg-blue-600/20">
                <f.icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer — full width */}
      <footer className="relative z-10 py-4 px-8 md:px-16 lg:px-24 flex items-center justify-between border-t border-slate-800/50">
        <p className="text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} DigiDukan. All rights reserved.
        </p>
        <p className="text-slate-500 text-xs">
          Created with love by{" "}
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
