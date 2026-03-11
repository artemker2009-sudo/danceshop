"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LogOut,
  Plus,
  MapPin,
  Phone,
  Send,
  Calendar,
  Trash2,
  Package,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useStore } from "../lib/store";
import { formatPrice, timeAgo, LABEL, formatMonthYear } from "../lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { userItems, deleteItem } = useStore();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 sm:pb-8">
      {/* Profile header */}
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-6 pt-4 sm:px-6 sm:pt-8">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-violet-100 sm:h-20 sm:w-20">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-violet-600">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold text-zinc-900 sm:text-xl">
                {user.name}
              </h1>
              {user.city && (
                <div className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{user.city}</span>
                </div>
              )}
              <div className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-400">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>На ProDance с {formatMonthYear(user.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Contact pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600">
              <Phone className="h-3 w-3" />
              {user.phone_number}
            </span>
            {user.telegram && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600">
                <Send className="h-3 w-3" />
                {user.telegram}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Quick actions */}
        <div className="mt-4 space-y-2">
          <Link
            href="/market/create"
            className="flex items-center gap-3 rounded-2xl bg-violet-600 px-4 py-3.5 text-white transition-colors hover:bg-violet-700 active:bg-violet-800"
          >
            <Plus className="h-5 w-5" />
            <span className="flex-1 text-sm font-semibold">
              Разместить объявление
            </span>
            <ChevronRight className="h-4 w-4 opacity-60" />
          </Link>

          <button
            onClick={() => {
              if (confirm("Выйти из аккаунта?")) logout();
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-zinc-600 transition-colors hover:bg-zinc-50 active:bg-zinc-100"
          >
            <LogOut className="h-5 w-5 text-zinc-400" />
            <span className="flex-1 text-left text-sm font-medium">
              Выйти из аккаунта
            </span>
          </button>
        </div>

        {/* My listings */}
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-zinc-800">
            Мои объявления
            {userItems.length > 0 && (
              <span className="ml-1.5 text-zinc-400">{userItems.length}</span>
            )}
          </h2>

          {userItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white py-12 text-center">
              <Package className="mx-auto mb-2 h-10 w-10 text-zinc-300" />
              <p className="text-sm font-medium text-zinc-400">
                У вас пока нет объявлений
              </p>
              <Link
                href="/market/create"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
              >
                <Plus className="h-4 w-4" />
                Разместить первое
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-zinc-900">
                      {formatPrice(item.price)}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-zinc-600">
                      {item.title}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                        {LABEL[item.category]}
                      </span>
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                        {LABEL[item.condition]}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {timeAgo(item.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Удалить объявление?")) deleteItem(item.id);
                    }}
                    className="shrink-0 self-center rounded-lg p-2 text-zinc-300 transition-colors hover:bg-red-50 hover:text-red-500 active:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
