"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-gray-500 hover:text-red-500 w-full text-left px-3 py-1"
    >
      Sign out
    </button>
  );
}
