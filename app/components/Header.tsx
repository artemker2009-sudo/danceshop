"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Plus, UserCircle, Search } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const tabs = [
    { href: "/market", label: "Каталог", icon: Search },
    { href: "/market/create", label: "Продать", icon: Plus },
    { href: "/profile", label: "Профиль", icon: UserCircle },
  ];

  return (
    <>
      {/* Desktop header */}
      <nav className="hidden sm:block sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/market"
            className="flex items-center gap-2 text-lg font-bold text-zinc-900"
          >
            <Store className="h-5 w-5 text-violet-600" />
            ProDance
          </Link>
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-violet-50 text-violet-700"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
            {user && (
              <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/90 backdrop-blur-lg sm:hidden">
        <div className="flex">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
                  active ? "text-violet-600" : "text-zinc-400"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </Link>
            );
          })}
        </div>
        {/* Safe area spacer for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
}
