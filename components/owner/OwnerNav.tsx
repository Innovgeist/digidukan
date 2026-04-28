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
  onClick,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 text-sm rounded-lg px-3 py-2.5 transition-colors ${
        active
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
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
        active ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      <Icon className={`w-[22px] h-[22px] ${active ? "" : "opacity-80"}`} strokeWidth={active ? 2.4 : 2} />
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

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 p-5 h-screen sticky top-0 shrink-0">
        <div className="mb-8 px-1">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.png" alt="DigiDukan" width={32} height={32} />
            <span className="text-lg font-bold text-blue-600">DigiDukan</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <SidebarLink key={item.href} {...item} active={isActive(item)} />
          ))}
        </nav>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <p className="text-xs text-gray-500 mb-3 truncate px-1">{email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors w-full px-1"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top header — minimal */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-14 flex items-center justify-center px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.png" alt="DigiDukan" width={28} height={28} />
          <span className="text-base font-bold text-blue-600">DigiDukan</span>
        </Link>
      </header>

      {/* Mobile bottom tab nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 h-16 flex items-stretch"
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
            accountActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User className="w-[22px] h-[22px]" strokeWidth={2} />
          <span className="text-[11px] font-medium">Account</span>
        </button>
      </nav>

      {/* Account sheet (mobile only) */}
      {accountOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 animate-fade-in"
            onClick={() => setAccountOpen(false)}
          />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-slide-up">
            <div className="flex justify-center pt-3 pb-1">
              <span className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-2 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Account</h3>
              <button
                onClick={() => setAccountOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div
              className="p-5 space-y-3"
              style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
            >
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                  {(email[0] ?? "?").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{email}</p>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
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
