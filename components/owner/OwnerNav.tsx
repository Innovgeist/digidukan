"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/shops", label: "My Shops", icon: Store },
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
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </Link>
  );
}

export function OwnerNav({ email }: { email: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const sidebar = (
    <>
      <div className="mb-8 px-1">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.png" alt="DigiDukan" width={32} height={32} />
          <span className="text-lg font-bold text-blue-600">DigiDukan</span>
        </Link>
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
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 p-5 h-screen sticky top-0 shrink-0">
        {sidebar}
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.png" alt="DigiDukan" width={28} height={28} />
          <span className="text-base font-bold text-blue-600">DigiDukan</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-700 p-1"
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
          <aside className="lg:hidden fixed top-0 left-0 z-50 w-64 h-full bg-white p-5 flex flex-col shadow-xl">
            {sidebar}
          </aside>
        </>
      )}
    </>
  );
}
