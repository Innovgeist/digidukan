"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  LogOut,
  User,
  X,
  Bell,
  HelpCircle,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/shops", label: "Shops", icon: Store },
];

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-[family-name:var(--font-jakarta)] text-sm font-medium transition-colors ${
        active
          ? "bg-primary-container/10 text-primary border-r-4 border-primary"
          : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" strokeWidth={active ? 2.4 : 2} />
      {label}
    </Link>
  );
}

function BottomTab({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-colors ${
        active
          ? "text-primary"
          : "text-on-surface-variant/70 hover:text-on-surface-variant"
      }`}
    >
      <span
        className={`flex items-center justify-center px-3 py-1 rounded-xl ${
          active ? "bg-primary-container/10" : ""
        }`}
      >
        <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.4 : 2} />
      </span>
      <span className={`text-[11px] ${active ? "font-semibold" : "font-medium"}`}>
        {label}
      </span>
    </Link>
  );
}

export function OwnerNav({ email }: { email: string }) {
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const accountActive = accountOpen;
  const initial = (email[0] ?? "?").toUpperCase();

  return (
    <>
      {/* Desktop sidebar — 280px Stitch design */}
      <aside className="hidden lg:flex flex-col w-[280px] border-r border-outline-variant/30 bg-surface-container-lowest shadow-sm h-screen sticky top-0 shrink-0 p-4 z-40 font-[family-name:var(--font-jakarta)]">
        <div className="mb-8 px-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container/10 overflow-hidden flex items-center justify-center">
            <Image src="/logo.png" alt="DigiDukan" width={32} height={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">DigiDukan</h2>
            <p className="font-[family-name:var(--font-inter)] text-[12px] font-semibold tracking-wide text-on-surface-variant">
              Owner Console
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <SidebarLink key={item.href} {...item} active={isActive(item)} />
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-outline-variant/30 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-primary-container/10 text-primary flex items-center justify-center font-semibold text-sm">
              {initial}
            </div>
            <p className="text-xs text-on-surface-variant truncate flex-1">{email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium hover:bg-surface-variant transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-14 flex items-center justify-between px-4 font-[family-name:var(--font-jakarta)]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.png" alt="DigiDukan" width={26} height={26} />
          <span className="text-base font-extrabold tracking-tight text-primary">
            DigiDukan
          </span>
        </Link>
        <div className="flex items-center gap-3 text-on-surface-variant">
          <Bell className="w-5 h-5" strokeWidth={2} />
          <HelpCircle className="w-5 h-5" strokeWidth={2} />
          <button
            onClick={() => setAccountOpen(true)}
            className="w-8 h-8 rounded-full bg-primary-container/10 text-primary flex items-center justify-center font-semibold text-xs"
            aria-label="Account"
          >
            {initial}
          </button>
        </div>
      </header>

      {/* Mobile bottom tab nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-outline-variant/30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] h-16 flex items-stretch font-[family-name:var(--font-jakarta)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {navItems.map((item) => (
          <BottomTab
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={isActive(item)}
          />
        ))}
        <button
          onClick={() => setAccountOpen(true)}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
            accountActive
              ? "text-primary"
              : "text-on-surface-variant/70 hover:text-on-surface-variant"
          }`}
        >
          <span
            className={`flex items-center justify-center px-3 py-1 rounded-xl ${
              accountActive ? "bg-primary-container/10" : ""
            }`}
          >
            <User className="w-[22px] h-[22px]" strokeWidth={accountActive ? 2.4 : 2} />
          </span>
          <span
            className={`text-[11px] ${accountActive ? "font-semibold" : "font-medium"}`}
          >
            Account
          </span>
        </button>
      </nav>

      {/* Account sheet (mobile) */}
      {accountOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 animate-fade-in"
            onClick={() => setAccountOpen(false)}
          />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest rounded-t-2xl shadow-2xl animate-slide-up font-[family-name:var(--font-jakarta)]">
            <div className="flex justify-center pt-3 pb-1">
              <span className="w-10 h-1 bg-outline-variant rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-2 border-b border-outline-variant/30">
              <h3 className="font-semibold text-on-surface">Account</h3>
              <button
                onClick={() => setAccountOpen(false)}
                className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div
              className="p-5 space-y-3"
              style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
            >
              <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 text-primary flex items-center justify-center font-semibold">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-on-surface-variant">Signed in as</p>
                  <p className="text-sm font-medium text-on-surface truncate">
                    {email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-error-container text-on-error-container hover:opacity-90 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
