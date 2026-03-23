"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  CreditCard,
  FileText,
  Flag,
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
      className={`flex items-center gap-3 text-sm rounded-lg px-3 py-2.5 transition-colors ${
        active
          ? "bg-blue-600 text-white font-medium"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
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

  const sidebar = (
    <>
      <div className="mb-8 px-1">
        <p className="text-lg font-bold text-white">DigiDukan</p>
        <p className="text-xs text-slate-500 mt-0.5">Admin Panel</p>
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
      <div className="border-t border-slate-700 pt-4 mt-4">
        <p className="text-xs text-slate-500 mb-3 truncate px-1">{email}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors w-full px-1"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900 p-5 h-screen sticky top-0 shrink-0">
        {sidebar}
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 px-4 py-3 flex items-center justify-between">
        <p className="text-base font-bold text-white">DigiDukan Admin</p>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-1"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 z-50 w-64 h-full bg-slate-900 p-5 flex flex-col">
            {sidebar}
          </aside>
        </>
      )}
    </>
  );
}
