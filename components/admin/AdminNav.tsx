"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  CreditCard,
  FileText,
  Flag,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/owners", label: "Owners", icon: Users },
  { href: "/admin/shops", label: "Shops", icon: Store },
  { href: "/admin/plans", label: "Plans", icon: CreditCard },
  { href: "/admin/logs", label: "Logs", icon: FileText },
  { href: "/admin/flags", label: "Flags", icon: Flag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavLink({
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

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const initial = (email[0] ?? "?").toUpperCase();

  const sidebar = (
    <>
      <div className="mb-8 px-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-container/10 overflow-hidden flex items-center justify-center">
          <Image src="/logo.png" alt="DigiDukan" width={32} height={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">DigiDukan</h2>
          <p className="font-[family-name:var(--font-inter)] text-[12px] font-semibold tracking-wide text-on-surface-variant">
            Super Admin
          </p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={isActive(item)}
            onClick={() => setMobileOpen(false)}
          />
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
    </>
  );

  return (
    <>
      {/* Desktop sidebar — Stitch style 280px */}
      <aside className="hidden lg:flex flex-col w-[280px] border-r border-outline-variant/30 bg-surface-container-lowest shadow-sm h-screen sticky top-0 shrink-0 p-4 z-40">
        {sidebar}
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-14 flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.png" alt="DigiDukan" width={26} height={26} />
          <span className="text-base font-extrabold tracking-tight text-primary">
            DigiDukan Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-on-surface-variant p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 z-50 w-72 h-full bg-surface-container-lowest p-4 flex flex-col shadow-stitch-2">
            {sidebar}
          </aside>
        </>
      )}
    </>
  );
}
