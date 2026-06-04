"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  LayoutDashboard,
  MessageCircle,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Tags,
  WalletCards,
} from "lucide-react";
import {
  defaultHomeLanguage,
  homeCopy,
  type HomeLanguage,
} from "@/lib/i18n/home";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const languageStorageKey = "digidukan-home-language";

const featureIcons: LucideIcon[] = [
  Store,
  ShoppingBag,
  Tags,
  QrCode,
  MessageCircle,
  LayoutDashboard,
  WalletCards,
  BarChart3,
  ShieldCheck,
];

const audienceImages = ["/landing1.png", "/landing4.png", "/landing7.png"];

// Bento layout for 12-column grid on large screens
const bentoLayouts = [
  "lg:col-span-7", // 0: Digital shop page
  "lg:col-span-5", // 1: Product catalog
  "lg:col-span-5", // 2: Categories and collections
  "lg:col-span-7", // 3: QR code sharing
  "lg:col-span-4", // 4: WhatsApp cart
  "lg:col-span-4", // 5: Owner dashboard
  "lg:col-span-4", // 6: Plans and limits
  "lg:col-span-7", // 7: Basic analytics
  "lg:col-span-5", // 8: Admin panel
];

function getStoredLanguage(): HomeLanguage {
  if (typeof window === "undefined") return defaultHomeLanguage;
  const stored = window.localStorage.getItem(languageStorageKey);
  return stored === "en" || stored === "hi" ? stored : defaultHomeLanguage;
}

export function HomeLanding() {
  const [language, setLanguage] = useState<HomeLanguage>(defaultHomeLanguage);

  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    setLanguage(storedLanguage);
    document.documentElement.lang = storedLanguage;
  }, []);

  useEffect(() => {
    window.localStorage.setItem(languageStorageKey, language);
    document.documentElement.lang = language;
  }, [language]);

  const copy = homeCopy[language];
  const featureItems = useMemo(
    () =>
      copy.features.map((feature, index) => ({
        ...feature,
        Icon: featureIcons[index] ?? Store,
      })),
    [copy.features],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="DigiDukan logo"
              width={38}
              height={38}
              className="h-9 w-9 shrink-0 rounded-xl object-contain"
              priority
            />
            <span className="text-xl font-black tracking-tight text-blue-700 sm:text-2xl">
              DigiDukan
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-50 p-1"
              aria-label={copy.languageLabel}
            >
              {(["hi", "en"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLanguage(item)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${language === item
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                  aria-pressed={language === item}
                >
                  {item === "hi" ? "हिंदी" : "EN"}
                </button>
              ))}
            </div>
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 sm:inline-flex"
            >
              {copy.nav.login}
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            >
              {copy.nav.create}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 pb-20 pt-16 sm:pb-28 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
          <div>
            {/* Heading — each line is its own block so no overlap */}
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="block leading-[1.5]">{copy.hero.title}</span>
              <span className="mt-2 block bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text pt-1 leading-[1.5] text-transparent">
                {copy.hero.highlight}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              {copy.hero.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-500 px-7 py-3 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-400"
              >
                {copy.hero.primaryCta}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] px-7 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15"
              >
                {copy.hero.secondaryCta}
              </Link>
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />
              {copy.hero.trusted}
            </p>

            {/* Stats — full width, no max-w constraint to prevent overflow */}
            <div className="mt-9 grid w-full grid-cols-3 gap-2 sm:gap-3">
              {copy.stats.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col justify-center rounded-xl border border-white/10 bg-white/5 p-2 sm:p-3 backdrop-blur-sm"
                >
                  <div className="text-[13px] font-black tracking-tight text-white sm:text-lg">
                    {item.value}
                  </div>
                  <div className="mt-1 text-[10px] leading-tight text-slate-400 sm:text-[11px] sm:leading-4">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <HeroVisual copy={copy.visual} />
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={copy.howTitle} subtitle={copy.howSubtitle} />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.steps.map((step, index) => (
              <article
                key={step.title}
                className="group relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-row items-start gap-4 sm:block">
                  <div className="mb-0 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-600 ring-1 ring-blue-100 sm:mb-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-500">
                      Step {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-slate-500">{step.description}</p>
                  </div>
                </div>
                {index < copy.steps.length - 1 && (
                  <ArrowRight className="absolute -right-2 top-8 hidden h-4 w-4 text-slate-300 lg:block" />
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES — BENTO ─────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={copy.featuresTitle}
            subtitle={copy.featuresSubtitle}
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
            {featureItems.map(({ Icon, title, description }, index) => {
              const colSpan = bentoLayouts[index];
              const isRowOne = index === 0 || index === 1;
              const isRowFour = index === 7 || index === 8;
              const isSpecialNarrow = index === 4 || index === 5 || index === 6;

              let textWidth = "sm:w-[50%]";
              let imgWidth = "sm:w-[60%]";
              if (colSpan === "lg:col-span-7") {
                textWidth = "sm:w-[45%] sm:pr-6";
                imgWidth = "sm:w-[65%]";
              } else if (colSpan === "lg:col-span-5") {
                textWidth = "sm:w-[55%] sm:pr-4";
                imgWidth = "sm:w-[55%]";
              } else if (isSpecialNarrow) {
                textWidth = "sm:w-[52%] sm:pr-4";
                imgWidth = "sm:w-[50%]";
              }

              return (
                <article
                  key={title}
                  className={`group relative overflow-hidden rounded-3xl ring-1 transition-all bg-white ring-slate-100 hover:ring-blue-200 sm:col-span-1 ${colSpan} min-h-[280px] ${isRowOne
                      ? "sm:min-h-[320px]"
                      : isSpecialNarrow
                        ? "sm:min-h-[90px]"
                        : isRowFour
                          ? "sm:min-h-[150px]"
                          : "sm:min-h-[200px]"
                    }`}
                >
                  {/* Background Image Container */}
                  <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[70%] z-0 overflow-hidden rounded-3xl sm:rounded-l-none">
                    <Image
                      src={`/features/card_${index + 1}.png`}
                      alt={title}
                      fill
                      className={`object-cover transition-transform duration-700 ease-out ${isSpecialNarrow
                          ? "sm:object-contain scale-110 group-hover:scale-125 sm:scale-[1.2] sm:group-hover:scale-[1.3] origin-right"
                          : "group-hover:scale-105"
                        } ${isRowFour ? "sm:translate-x-6" : ""} ${index === 0 ? "object-bottom sm:object-center" : "object-bottom sm:object-right"
                        }`}
                    />
                    {/* Fade left edge into the white background (Desktop) */}
                    <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-gradient-to-r from-white via-white/95 to-transparent hidden sm:block" />
                  </div>

                  {/* Content Container - Bottom aligned on mobile, centered on desktop */}
                  <div className={`relative z-10 flex h-full flex-col justify-end sm:justify-center p-3 sm:p-6 ${isSpecialNarrow ? "sm:px-6 sm:py-2" : "sm:p-8"} ${textWidth}`}>
                    {isRowOne ? (
                      // Horizontal on mobile, Vertical on desktop for Row 1
                      <div className="flex flex-row sm:flex-col items-start sm:items-stretch gap-2 sm:gap-4 mt-1 sm:mt-0 bg-white/80 sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none backdrop-blur-md sm:backdrop-blur-none shadow-sm sm:shadow-none border border-white/50 sm:border-transparent">
                        <div className="flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-2xl bg-blue-600 text-white shadow-sm group-hover:bg-blue-700">
                          <Icon className="h-3.5 w-3.5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 sm:text-2xl">{title}</h3>
                          <p className="mt-0.5 sm:mt-2 text-xs leading-tight text-slate-600 sm:text-base sm:leading-6">{description}</p>
                        </div>
                      </div>
                    ) : (
                      // Horizontal on both mobile and desktop
                      <div className="flex flex-row items-start gap-2 sm:gap-4 mt-1 sm:mt-0 bg-white/80 sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none backdrop-blur-md sm:backdrop-blur-none shadow-sm sm:shadow-none border border-white/50 sm:border-transparent">
                        <div className={`flex h-8 w-8 sm:${isSpecialNarrow ? "h-10 w-10" : "h-12 w-12"} shrink-0 items-center justify-center rounded-lg sm:rounded-2xl bg-blue-600 text-white shadow-sm group-hover:bg-blue-700 sm:mt-0.5`}>
                          <Icon className={`h-3.5 w-3.5 sm:${isSpecialNarrow ? "h-5 w-5" : "h-6 w-6"}`} />
                        </div>
                        <div>
                          <h3 className={`${isSpecialNarrow ? "text-[13px] sm:text-base" : "text-sm sm:text-lg"} font-black text-slate-900`}>{title}</h3>
                          <p className={`mt-0.5 sm:${isSpecialNarrow ? "mt-0.5 leading-snug" : "mt-1.5 leading-6"} text-xs sm:text-sm leading-tight sm:leading-snug text-slate-600`}>{description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <SectionHeader
              align="left"
              title={copy.audienceTitle}
              subtitle={copy.audienceSubtitle}
            />
            <div className="mt-8 flex flex-wrap gap-2">
              {copy.audiences.map((audience) => (
                <span
                  key={audience}
                  className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm"
                >
                  {audience}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700"
              >
                {copy.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {audienceImages.map((src, index) => (
              <div
                key={src}
                className="relative min-h-56 overflow-hidden rounded-2xl bg-slate-200 shadow-sm ring-1 ring-slate-200 sm:min-h-72"
              >
                <Image
                  src={src}
                  alt={`${copy.audienceTitle} ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            inverse
            title={copy.plansTitle}
            subtitle={copy.plansSubtitle}
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {copy.plans.map((plan, index) => (
              <article
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl p-7 ${index === 0
                  ? "border border-white/10 bg-white/5 backdrop-blur-sm"
                  : "border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm"
                  }`}
              >
                {index === 1 && (
                  <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-blue-400/20 px-3 py-1 text-xs font-bold text-blue-300">
                    <Sparkles className="h-3 w-3" />
                    Popular
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${index === 0 ? "bg-white/10" : "bg-blue-400/20"
                      }`}
                  >
                    <WalletCards
                      className={`h-6 w-6 ${index === 0 ? "text-slate-300" : "text-blue-300"}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{plan.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{plan.description}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {plan.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2.5 rounded-xl bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-slate-200"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />
                      {point}
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    href="/signup"
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${index === 0
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400"
                      }`}
                  >
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* DigiDukan logo — not an icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 shadow-lg shadow-blue-100 ring-1 ring-blue-100">
            <Image
              src="/logo.png"
              alt="DigiDukan"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            {copy.finalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-500">
            {copy.finalCta.description}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
            >
              {copy.finalCta.primary}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50"
            >
              {copy.finalCta.secondary}
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="DigiDukan"
              width={28}
              height={28}
              className="h-7 w-7 rounded-lg"
            />
            <span className="text-sm font-bold text-blue-700">DigiDukan</span>
          </div>
          <p className="text-xs text-slate-400">© 2025 DigiDukan. All rights reserved.</p>
        </div>
      </footer>

      {/* ── FLOATING LANGUAGE TOGGLE (MOBILE ONLY) ──────────────────────── */}
      <div className="fixed bottom-12 right-6 z-50 sm:hidden">
        <button
          type="button"
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          className="flex items-center justify-center rounded-2xl border border-slate-200/60 bg-white/90 px-4 py-2.5 shadow-xl shadow-slate-200/50 backdrop-blur-md transition-all active:scale-95"
          aria-label="Toggle language"
        >
          <span className="text-sm font-bold text-blue-600">
            {language === "en" ? "हिंदी" : "EN"}
          </span>
        </button>
      </div>
    </main>
  );
}

function SectionHeader({
  title,
  subtitle,
  align = "center",
  inverse = false,
}: {
  title: string;
  subtitle: string;
  align?: "left" | "center";
  inverse?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : ""}>
      <h2
        className={`text-3xl font-black tracking-tight sm:text-4xl ${inverse ? "text-white" : "text-slate-900"
          }`}
      >
        {title}
      </h2>
      <p
        className={`mt-3 text-base leading-7 ${inverse ? "text-slate-400" : "text-slate-500"
          }`}
      >
        {subtitle}
      </p>
    </div>
  );
}

/* ── QR Code SVG — proper finder patterns + data modules ─────────── */
function QRCodeSVG() {
  const N = 21;
  const C = 14; // cell size in SVG units

  // Build 21×21 grid (−1 = unset, 0 = light, 1 = dark)
  const grid = Array.from({ length: N }, () => Array(N).fill(-1));

  const FINDER = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];

  const placeFinder = (r: number, c: number) =>
    FINDER.forEach((row, i) =>
      row.forEach((v, j) => { grid[r + i][c + j] = v; })
    );

  placeFinder(0, 0);   // top-left
  placeFinder(0, 14);  // top-right
  placeFinder(14, 0);  // bottom-left

  // Separators
  for (let i = 0; i <= 7; i++) { grid[7][i] = 0; grid[i][7] = 0; }        // TL
  for (let i = 13; i <= 20; i++) grid[7][i] = 0;                           // TR row
  for (let i = 0; i <= 7; i++) grid[i][13] = 0;                            // TR col
  for (let i = 0; i <= 7; i++) grid[13][i] = 0;                            // BL row
  for (let i = 14; i <= 20; i++) grid[i][7] = 0;                           // BL col

  // Timing patterns (row 6 and col 6, cols/rows 8–12)
  for (let i = 8; i <= 12; i++) {
    if (grid[6][i] === -1) grid[6][i] = i % 2 === 0 ? 1 : 0;
    if (grid[i][6] === -1) grid[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // Fill data area with deterministic pseudo-random pattern
  const DATA = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1];
  let di = 0;
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (grid[r][c] === -1) {
        grid[r][c] = DATA[di % DATA.length];
        di++;
      }
    }
  }

  const size = N * C;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      <rect width={size} height={size} fill="white" />
      {grid.flatMap((row, r) =>
        row.map((cell, c) =>
          cell === 1 ? (
            <rect
              key={`${r}-${c}`}
              x={c * C}
              y={r * C}
              width={C}
              height={C}
              fill="#0f172a"
            />
          ) : null
        )
      )}
    </svg>
  );
}

function HeroVisual({ copy }: { copy: (typeof homeCopy)[HomeLanguage]["visual"] }) {
  return (
    <div className="relative mx-auto w-full max-w-sm lg:mr-0">
      <div className="absolute inset-0 -z-10 scale-95 rounded-3xl bg-blue-500/20 blur-2xl" />

      <div className="relative grid gap-3 sm:grid-cols-[1fr_1fr]">
        {/* QR card */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="overflow-hidden rounded-xl bg-white p-3 shadow-xl shadow-black/30 w-44 h-44">
            <QRCodeSVG />
          </div>
          <div className="w-44 rounded-xl bg-blue-500/20 px-2.5 py-2 text-center text-[10px] font-bold leading-tight text-blue-300">
            digidukan.in/s/raj-store
          </div>
        </div>

        {/* Phone mockup */}
        <div className="rounded-[26px] border-[9px] border-slate-800 bg-slate-800 shadow-2xl shadow-black/50">
          <div className="overflow-hidden rounded-[18px] bg-white">
            <div className="relative h-28">
              <Image
                src="/shop.png"
                alt={copy.storefront}
                fill
                className="object-cover"
                sizes="260px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-[10px] font-semibold opacity-80">{copy.storefront}</div>
                <div className="mt-0.5 text-base font-black">Raj Store</div>
              </div>
            </div>

            <div className="space-y-2 p-3">
              <PhoneItem title={copy.itemOne} price="₹120" />
              <PhoneItem title={copy.itemTwo} price="₹180" />
              <div className="flex items-center justify-between rounded-xl bg-blue-600 px-3 py-2.5 text-white">
                <div className="flex flex-col items-start">
                  <div className="text-[9px] font-semibold text-blue-200 pb-1">{copy.cart}</div>
                  <div className="text-xs font-black">{copy.order}</div>
                </div>
                <WhatsAppIcon className="h-4 w-4 text-blue-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneItem({ title, price }: { title: string; price: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <div className="min-w-0">
        <div className="truncate text-xs font-bold text-slate-900">{title}</div>
        <div className="text-[10px] font-semibold text-slate-500">{price}</div>
      </div>
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-50">
        <Boxes className="h-3.5 w-3.5 text-blue-500" />
      </div>
    </div>
  );
}
